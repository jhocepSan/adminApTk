import { ThemedLoader } from '@/components/themed-loading';
import { IconSet } from '@/constants/typesdata';
import { useAppContext } from '@/context/context-aplication';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, ToastAndroid, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import ApiRest from '../restapi/api';
type SearchParams = {
    id: number;
    tipo: string;
};
interface UbicacionCoords {
    latitud: number;
    longitud: number;
}

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

export default function PositionMap() {
    const { loading,setLoading, setInfoHelp, infoHelp } = useAppContext();
    const { id, tipo } = useLocalSearchParams() as unknown as SearchParams;
    const ubicacion = useRef<UbicacionCoords | null>(null);
    const webViewRef = useRef<WebView>(null);

    const manejarMensaje = (event: any) => {
        const datos = JSON.parse(event.nativeEvent.data);
        ubicacion.current = {latitud:datos.lat,longitud:datos.lng};// Aquí ya tienes la lat y lng actualizadas
    };

    const guardarUbicacion = async () => {
        try {
            setLoading(true);
            const result = await ApiRest.agregarLocation({tipo,idubicacion:id,...ubicacion.current});
            console.log({tipo,idubicacion:id,...ubicacion.current})
            if(result.ok){
                setInfoHelp({ ...infoHelp, 'idubicacion':result.ok.insertId===0?id:result.ok.insertId,...ubicacion.current})
                router.back()
            }else{
                ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado';
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        } finally {
            setLoading(false);
        }
        
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
                .bindPopup("",{autoClose: true})
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
                    const tipo='${tipo}'
                    if(tipo=='C'){
                        clubMarker.bindPopup("Ubicación Club").openPopup()
                    }else if (tipo=='D'){
                        clubMarker.bindPopup("Ubicación Docente").openPopup()
                    }else{
                        clubMarker.bindPopup("Ubicación").openPopup()
                    }
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
            latitud: location.coords.latitude,
            longitud: location.coords.longitude
        };

        ubicacion.current = nuevasCoords;

        // ENVIAR LAS COORDENADAS AL MAPA
        const script = `window.postMessage(JSON.stringify({
            lat: ${nuevasCoords.latitud}, 
            lng: ${nuevasCoords.longitud}
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
                        onPress={() => guardarUbicacion()}
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
            <ThemedLoader
                visible={loading} fullscreen
            />
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