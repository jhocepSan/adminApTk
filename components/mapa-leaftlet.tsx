import { useAppContext } from '@/context/context-aplication';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';


export default function MapaLeaflet() {
  const { user } = useAppContext();
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const webViewRef = useRef<WebView>(null);
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location.coords);
  }
  useEffect(() => {
    getLocation()
  }, [])

  useEffect(() => {
    if (location && webViewRef.current && user) {
      webViewRef.current?.injectJavaScript(`
        const bounds = L.latLngBounds([
          [${user?.latitud}, ${user?.longitud}],
          [${location?.latitude}, ${location?.longitude}]
        ]);
        userMarker.setLatLng([${location.latitude}, ${location.longitude}]);
        map.fitBounds(bounds, { padding: [50, 50] });
        true;
      `);
    }
  }, [location]);
  const leafletHTML = `
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
      window.clubMarker = L.marker([${user?.latitud}, ${user?.longitud}], { icon: clubIcon })
        .addTo(map)
        .bindPopup('Ubicación Club',{autoClose: false})
        .openPopup();
      window.userMarker = L.marker([${location?.latitude}, ${location?.longitude}])
        .addTo(map)
        .bindPopup('¡Aquí estoy!')
        .openPopup();
    </script>
  </body>
  </html>
  `;
  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: leafletHTML }}
        style={styles.webview}
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
