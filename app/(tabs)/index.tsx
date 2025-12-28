import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/context/context-aplication';
import { Link } from 'expo-router';

export default function HomeScreen() {
  const {isLogin} = useAppContext();
  if (isLogin==true) return null;
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/tk-welcome.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Bienvenid@ !</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Uso 1: Registro Estudiantes</ThemedText>
        <ThemedText>
          Un informe detallado de los alumnos inscritos en su club, administrar el ingreso 
          de nuevos estudiantes, y editar la información de los estudiantes existentes.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Uso 2: Control Asistencia</ThemedText>
        <ThemedText>
          Tener control de la asistencia de los estudiantes, de los diferentes horarios 
          de las clases, y de los diferentes días de la semana.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Uso 3: Registro Horarios</ThemedText>
        <ThemedText>
          Mayor control de los horarios de las clases, del club y de los alumnos.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Uso 4: Registro Competiciones</ThemedText>
        <ThemedText>
          Registra de manera sencilla a los estudiantes, en las diferentes actividades de la
          <ThemedText type='defaultSemiBold'> "Asociación Tradicional de Taekwondo" </ThemedText>
           manteniendo un control de cantidad de alumnos inscritos.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Uso 5: Examenes del Club</ThemedText>
        <ThemedText>
          Control de los diferentes exámenes que se realizan en el club, de manera sencilla.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Uso 6: Administración de la Información de su Club</ThemedText>
        <ThemedText>
          Modifica datos del club, ubicación, logo, etc.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      {false&&<ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,

  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 190,
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
