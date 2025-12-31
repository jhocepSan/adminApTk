import { IconSet } from '@/constants/typesdata';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

type SearchParams = {
    id: number;
    tipo: string;
};

function RenderIcon({
    icon,
    iconSet,
    color,
    size,
}: {
    icon: any;
    iconSet: IconSet;
    color: string;
    size: number;
}) {
    if (iconSet === 'material') {
        return <MaterialIcons name={icon} size={size} color={color} />;
    }

    return <Ionicons name={icon} size={size} color={color} />;
}

export default function positionmap() {
    const { id, tipo } = useLocalSearchParams<SearchParams>();
    const ubicacion = useRef(null);
    const webViewRef = useRef<WebView>(null);

    const manejarMensaje = (event: any) => {
        const datos = JSON.parse(event.nativeEvent.data);
        console.log(datos)
        ubicacion.current = datos;// Aquí ya tienes la lat y lng actualizadas
    };

    const guardarUbicacion = () => {
        console.log("Guardando ubicación seleccionada:", ubicacion);
        // Aquí puedes hacer el fetch a tu API o router.back()
    };
    const leafletHTML = useMemo(() => {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
            <style>html, body, #map { height: 100%; margin: 0; padding: 0; }</style>
        </head>
        <body>
            <div id="map"></div>
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
            <script>
            const clubIcon = L.icon({
                iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png', 
                iconSize: [32, 32],
                iconAnchor: [16, 32], 
                popupAnchor: [0, -32]
            });
            const map = L.map('map').setView([-16.5, -68.15], 13);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{ attribution: '' }).addTo(map);
            window.clubMarker = L.marker(map.getCenter(), { icon: clubIcon })
                .addTo(map)
                .bindPopup('Ubicación Club',{autoClose: true})
                .openPopup();
            map.on('move', function() {
                const centro = map.getCenter();
                clubMarker.setLatLng(centro);
            });

            // EVENTO: Cuando el movimiento termina, enviamos la ubicación a React Native
            map.on('moveend', function() {
                const centro = map.getCenter();
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    lat: centro.lat,
                    lng: centro.lng
                }));
            });
            window.addEventListener("message", (message) => {
                const coords = JSON.parse(message.data);
                if(coords.lat && coords.lng) {
                    map.setView([coords.lat, coords.lng], 15); // Centra el mapa
                    clubMarker.setLatLng([coords.lat, coords.lng]); // Mueve el marcador
                }
            });
            </script>
        </body>
        </html>
        `;
    }, []);
    const getLocation = async () => {

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return null;

        let location = await Location.getCurrentPositionAsync({});
        const nuevasCoords = {
            lat: location.coords.latitude,
            lng: location.coords.longitude
        };

        ubicacion.current = nuevasCoords;

        // ENVIAR LAS COORDENADAS AL MAPA
        const script = `window.postMessage(JSON.stringify({
            lat: ${nuevasCoords.lat}, 
            lng: ${nuevasCoords.lng}
        }), "*");`;

        webViewRef.current?.injectJavaScript(script);
    }
    useEffect(() => {

        const timer = setTimeout(() => {
            getLocation();
        }, 1000);
        return () => clearTimeout(timer);

    }, [])
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <WebView
                    ref={webViewRef}
                    originWhitelist={['*']}
                    source={{ html: leafletHTML }}
                    style={styles.webview}
                    onMessage={manejarMensaje}
                />
            </View>
            <View style={styles.contbuttons}>
                <View style={styles.columnas}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.button}
                    >
                        <RenderIcon
                            icon={'clear'}
                            iconSet={'material'}
                            color={'#fff'}
                            size={45} />
                    </Pressable>
                </View>
                <View style={styles.columnas}>
                    <Pressable
                        onPress={() => { }}
                        style={styles.button}
                    >
                        <RenderIcon
                            icon={'save'}
                            iconSet={'material'}
                            color={'#fff'}
                            size={45} />
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '90%',
    },
    webview: { flex: 1 },
    button: {
        borderRadius: 100, // Valor numérico para círculo
        borderColor: '#fff',
        borderWidth: 1,
        padding: 8, // Espacio entre el icono y el borde
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
    },
    contbuttons: {
        height: '10%', // Aumentamos de 10% a 15% para mejor manejo táctil
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'space-evenly', // Distribuye los botones equitativamente
        paddingHorizontal: 10,
    },
    columnas: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
})