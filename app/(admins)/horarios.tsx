import { AlertBlock } from '@/components/alert-bloque';
import { FormularioHorario } from '@/components/form-horario';
import HeaderDias from '@/components/head-dias';
import { FilaHorario } from '@/components/horario-class';
import { BaseModal } from '@/components/modal-comp';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedLoader } from '@/components/themed-loading';
import { ThemedView } from '@/components/themed-view';
import { horarioType } from '@/constants/typesdata';
import { useAppContext } from '@/context/context-aplication';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, ToastAndroid } from 'react-native';
import ApiRes from '../../restapi/api';

export default function TabTwoScreen() {
  const { loading, setLoading, user } = useAppContext()
  const [filtro, setFiltro] = useState<'L' | 'M' | 'MI' | 'J' | 'V' | 'S' | 'D'>('L');
  const [horarios, setHorarios] = useState<horarioType[]>([]);
  const [showModal,setShowModal] = useState<boolean>(false);
  const [editando,setEditando] = useState<boolean>(false);
  const [selectHorario,setSelectHorario] = useState<horarioType|null>();
  
  const getHorarios = async () => {
    try {
      setLoading(true);
      const result = await ApiRes.getHorarios({ idclub: user?.idclub, dia: filtro });
      if (result.ok) {
        setHorarios(result.ok);
      } else {
        ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado';
      ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
    } finally {
      setLoading(false);
    }
  }
  const guardarHorario = async(dato:horarioType)=>{
    try {
      const result = await ApiRes.addHorarios(dato);
      if(result.ok){
        setShowModal(false);
        await getHorarios();
      }else{
        ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado';
      ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    getHorarios()
  }, [filtro])
  return (
    <ThemedView style={{ flex: 1 }}>
      <ParallaxScrollView
        style={{ padding: 0 }}
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
          {horarios.length !== 0 ? (
            horarios.map((item, index) => (
              <FilaHorario
                key={index}
                info = {item}
                hora={item.hora_ini}
                actividad={item.descripcion}
                estaOcupado={item.activo===1?false:true}
                onPress={()=>{
                  setSelectHorario(item);
                  setEditando(true);
                  setShowModal(true);
                }}
              />
            ))) : (
            <AlertBlock type="empty"
              message="Sin Horario Registrados"
              description="No se encontraron registro de horarios para este dia"
              style={{ marginTop: 2 }} />
          )
          }
        </ThemedView>
      </ParallaxScrollView>
      <Pressable
        style={({ pressed }) => [
          styles.fab,
          { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
        ]}
        onPress={() => {
          setSelectHorario(null);
          setShowModal(true);
        }}
      >
        <Ionicons name="add" size={30} color="white" />
      </Pressable>
      <BaseModal visible={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={() => { }} 
        title= {`Horario Clase`} showFooter={false}>
        <FormularioHorario editando={editando} initialData={selectHorario}
          onAgregar={(info:horarioType)=>guardarHorario(info)}/>
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
