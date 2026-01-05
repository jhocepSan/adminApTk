import { useAppContext } from '@/context/context-aplication';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

// FUERA DEL COMPONENTE para que nunca cambie
const LEAFLET_HTML = `
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
      const redIcon = L.icon({
        iconUrl: 'https://img.icons8.com/?size=100&id=21613&format=png&color=FA5252',
        iconSize: [25, 25],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png');
      const esri = L.tileLayer('server.arcgisonline.com{z}/{y}/{x}');
      const hotosm = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',{maxZoom: 19,})

      const map = L.map('map', { center: [0, 0], zoom: 2, layers: [osm] });
      L.control.layers({"Estándar": osm, "OSM hot":hotosm,"Relieve": topo, "Satelital": esri}).addTo(map);

      // Creamos los marcadores vacíos una sola vez
      window.userMarker = L.marker([0,0],{ icon: redIcon }).addTo(map).bindPopup('¡Aquí estoy!');
      window.clubMarker = L.marker([0,0]); 
      
      // Función para inicializar el club (se llamará vía injectJavaScript)
      window.initClub = (lat, lng) => {
        if(lat && lat !== 0) {
          clubMarker.setLatLng([lat, lng]).addTo(map).bindPopup('Ubicación Club');
        }
      };
    </script>
  </body>
  </html>
`;


export default function MapaLeaflet() {
  const { user } = useAppContext();
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const webViewRef = useRef<WebView>(null);
  const isFirstLoad = useRef(true);
 /*
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const startWatching = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      // watchPositionAsync se ejecuta cada vez que el GPS detecta movimiento
      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // Alta precisión para movimiento
          timeInterval: 5000, // Actualiza cada 5 segundos
          distanceInterval: 5, // O cada 5 metros
        },
        (newLocation) => {
          // Esto actualizará el estado 'location' y disparará tu segundo useEffect
          setLocation(newLocation.coords);
          console.log(newLocation.coords)
        }
      );
    };

    startWatching();

    // Limpieza al cerrar el componente para ahorrar batería
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);*/
  useFocusEffect(
    useCallback(() => {
      let subscription: Location.LocationSubscription | null = null;

      const startWatching = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced, // Más estable que High para evitar saltos
            timeInterval: 5000,
            distanceInterval: 10,
          },
          (newLocation) => {
            // Filtro de precisión para evitar que "se vaya lejos"
            if (newLocation.coords.accuracy && newLocation.coords.accuracy < 35) {
              setLocation(newLocation.coords);
            }
          }
        );
      };

      startWatching();

      // LIMPIEZA AUTOMÁTICA: Se ejecuta al salir de la pestaña
      return () => {
        if (subscription) {
          subscription.remove();
          console.log("GPS Apagado - Ahorrando batería");
        }
      };
    }, []) // Dependencias vacías para que se cree la función una vez
  );

  useEffect(() => {
    if (location && webViewRef.current) {
      const hasClubCoords = user?.latitud && user?.longitud !== 0;

      let jsCode = `
        // Mover marcador de usuario sin recargar
        userMarker.setLatLng([${location.latitude}, ${location.longitude}]);
      `;

      if (isFirstLoad.current && hasClubCoords) {
        jsCode += `window.initClub(${user?.latitud}, ${user?.longitud});`;
        isFirstLoad.current = false;
      }

      if (hasClubCoords) {
        jsCode += `
          const bounds = L.latLngBounds([[${user?.latitud}, ${user?.longitud}], [${location.latitude}, ${location.longitude}]]);
          map.fitBounds(bounds, { padding: [50, 50] });
        `;
      } else {
        jsCode += `map.setView([${location.latitude}, ${location.longitude}], 16);`;
      }

      webViewRef.current?.injectJavaScript(jsCode + "true;");
    }
  }, [location, user,isMapReady]);
  
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: LEAFLET_HTML }}
        style={styles.webview}
        onLoadEnd={() => setIsMapReady(!isMapReady)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '70%',
  },
  webview: { flex: 1 }
});
