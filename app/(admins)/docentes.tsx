import { AlertBlock } from '@/components/alert-bloque';
import { DocenteCard } from '@/components/card-docente';
import ScrollableView from '@/components/contenedor-scroll-view';
import { FormularioDocente } from '@/components/formulario-docente';
import { BaseModal } from '@/components/modal-comp';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedLoader } from '@/components/themed-loading';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/context/context-aplication';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, ToastAndroid } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import ApiRest from '../../restapi/api';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Docente() {
  const { user, setLoading, loading, infoHelp, setInfoHelp } = useAppContext();
  const [docentes, setDocentes] = useState([]);
  const [editDocente, setEditDocente] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [cinturones, setCinturones] = useState([]);
  const [docSelect, setDocSelect] = useState<any>(null);
  const [editarDato,setEditarDato] = useState(false);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value }, // Mantiene el pulso
      { rotate: `${rotation.value}deg` } // Añade rotación
    ],
  }));
  const guardarInformacion = async (data: any) => {
    try {
      let datos={}
      if (infoHelp!=null){
        datos={...data,latitud:infoHelp.latitud,longitud:infoHelp.longitud,idubicacion:infoHelp.idubicacion}
      }else{
        datos = {...data}
      }
      const resul = await ApiRest.agregarDocente(datos);
      if (resul.ok) {
        setEditarDato(false);
        setDocSelect(null);
        setEditDocente(false);
        setInfoHelp(null);
        await obtenerInfo()
      } else {
        ToastAndroid.showWithGravity(resul.error, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado';
      ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
    } finally {
      setLoading(false);
    }
  }
  const cambiarEstado=async (info:any)=>{
    try {
      setLoading(true);
      const result = await ApiRest.editarEstadoDoc(info);
      if(result.ok){
        obtenerInfo();
      }else{
        ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);  
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado';
      ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
    }finally{
      setLoading(false);
    }
  }
  const obtenerInfo = async () => {
    try {
      setLoading(true)
      const infoDocente = await ApiRest.getDocentes({ 'idclub': user?.idclub });
      if (infoDocente.ok) {
        setDocentes(infoDocente.ok);
      } else {
        setDocentes([])
        console.log(infoDocente.error);
      }
      const infoClub = await ApiRest.getClubes();
      if (infoClub.ok) {
        setClubs(infoClub.ok)
      } else {
        setClubs([])
        console.log(infoClub.error);
      }
      const infoCinturon = await ApiRest.getCinturones({isclub:user?.idclub});
      if (infoCinturon.ok) {
        setCinturones(infoCinturon.ok);
      } else {
        setCinturones([]);
        console.log(infoCinturon.error);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    obtenerInfo()
  }, [])
  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );

    rotation.value = withRepeat(
      withTiming(360, { duration: 3000 }),
      -1,
      false
    );
  }, []);


  return (
    <ThemedView style={{ flex: 1 }}>
      <ParallaxScrollView
        style={{ padding: 0 }}
        headerBackgroundColor={{ light: '#3b6aec7a', dark: '#228be086' }}
        headerImage={
          <Image
            source={require('@/assets/images/docente_img.png')}
            style={styles.reactLogo}
          />
        }>
        <ScrollableView>
          {docentes.length !== 0 ? (
            docentes.map((item,index) => {
              return (
                <DocenteCard info={item} 
                  onEdit={(info)=>{
                    setEditarDato(true);
                    setDocSelect(info);
                    setEditDocente(true);
                  }}
                  onPress={(info) => {setEditarDato(false);setDocSelect(info);setEditDocente(true)}} 
                  onDelete={(info)=>cambiarEstado(info)}
                  onInactivate={(info)=>cambiarEstado(info)}
                  key={index} />
              )
            })
          ) : (
            <AlertBlock type="empty"
              message="Sin registros"
              description="No se encontraron docentes asignados a este club actualmente."
              style={{ marginTop: 2 }} />
          )}
        </ScrollableView>
      </ParallaxScrollView>
      <AnimatedPressable
        style={[
          styles.fab,
          animatedStyle, // Aquí aplicamos el pulso de zoom
          // Mantenemos el efecto visual de cuando el usuario lo presiona
        ]}
        onPress={() => {setDocSelect(null);setEditarDato(true);setEditDocente(true)}}
      >
        <Ionicons name="add" size={30} color="white" />
      </AnimatedPressable>
      <BaseModal visible={editDocente} onClose={() => setEditDocente(false)} onSave={() => { }} 
        title= {`${editarDato?'Editar Docente':'Datos Docente'}`} showFooter={false}>
        <FormularioDocente
          editar={editarDato}
          initialData={docSelect}
          clubes={clubs}
          cinturones={cinturones}
          onSave={(data) => guardarInformacion(data)} />
      </BaseModal>
      <ThemedLoader
        visible={loading} fullscreen
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 5,          // Distancia desde abajo
    right: 5,            // Distancia desde la izquierda (como pediste)
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: '#007AFF', // Azul estándar (puedes usar tu color de tema)
    justifyContent: 'center',
    alignItems: 'center',
    // Sombras
    elevation: 8,        // Sombra en Android
    shadowColor: '#6b6b6bff', // Sombra en iOS
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
