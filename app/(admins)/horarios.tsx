import HeaderDias from '@/components/head-dias';
import { FilaHorario } from '@/components/horario-class';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

export default function TabTwoScreen() {
  const [filtro, setFiltro] = useState<'L' | 'M' | 'MI' | 'J' | 'V' | 'S' | 'D'>('L');
  const horariosEjemplo = [
    { hora: '08:00', actividad: 'Clase de Matemáticas', ocupado: true },
    { hora: '09:30', actividad: 'Aula Libre', ocupado: false },
    { hora: '11:00', actividad: 'Física II', ocupado: true },
    { hora: '08:00', actividad: 'Clase de Matemáticas', ocupado: true },
    { hora: '09:30', actividad: 'Aula Libre', ocupado: false },
    { hora: '11:00', actividad: 'Física II', ocupado: true },
    { hora: '08:00', actividad: 'Clase de Matemáticas', ocupado: true },
    { hora: '09:30', actividad: 'Aula Libre', ocupado: false },
    { hora: '11:00', actividad: 'Física II', ocupado: true },
  ];
  return (
    <ThemedView style={{ flex: 1 }}>
      <ParallaxScrollView
        style={{padding: 0}}
        headerBackgroundColor={{ light: '#3b6aec7a', dark: '#228be086' }}
        headerImage={
          <Image
            source={require('@/assets/images/horarios-class.png')}
            style={styles.reactLogo}
          />
        }>
        <ThemedView style={styles.stickyWrapper}>
          <HeaderDias onPress={(val) => { setFiltro(val) }} seleccionado={filtro} />
        </ThemedView>
        <ThemedView style={styles.listaContainer}>
          {horariosEjemplo.map((item, index) => (
            <FilaHorario
              key={index}
              hora={item.hora}
              actividad={item.actividad}
              estaOcupado={item.ocupado}
            />
          ))}
        </ThemedView>
      </ParallaxScrollView>
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
        ]}
        onPress={() => console.log('Agregar horario')}
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
   fab: {
    position: 'absolute',
    bottom: 5,          // Distancia desde abajo
    right:5,            // Distancia desde la izquierda (como pediste)
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#007AFF', // Azul estándar (puedes usar tu color de tema)
    justifyContent: 'center',
    alignItems: 'center',
    // Sombras
    elevation: 8,        // Sombra en Android
    shadowColor: '#000', // Sombra en iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 10,          // Asegura que esté por encima de todo
  },
  stickyWrapper: {
    backgroundColor: '#2525259a', // O usa tu color de tema
    position: 'sticky',
    top: 0,
    zIndex: 1,
    // Estética
    //paddingVertical: 10,// Asegura que esté por encima de otros elementos
  },
  headerImage: {
    color: '#808080ff',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  reactLogo: {
    height: 190,
    width: '50%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  listaContainer: {
    paddingTop: 0,
    paddingBottom: 100, // Espacio para que el último no choque abajo
  },
});
