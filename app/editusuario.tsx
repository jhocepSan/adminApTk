import ScrollableView from '@/components/contenedor-scroll-view';
import { ThemedButton } from '@/components/themed-buton-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { useAppContext } from '@/context/context-aplication';
import api from '@/restapi/api';
import { router } from 'expo-router';
import { useState } from 'react';
import { StatusBar, StyleSheet, ToastAndroid } from 'react-native';

export default function EditUsuario() {
  const { user,setLoading,setUser } = useAppContext();
  const [nombres, setNombres] = useState(user?.nombres);
  const [apellidos, setApellidos] = useState(user?.apellido);
  const [ci, setCi] = useState(user?.cedula);
  const [correo, setCorreo] = useState(user?.correo);
  const [celular, setCelular] = useState(user?.celular);
  const saveInformacion = async () => {
    try {
      setLoading(true);
      if (nombres !== '' && apellidos !== '' && correo !== '') {
        const info = {
          "idUsuario": user?.id,
          "correo": correo,
          "nombres": nombres,
          "apellidos": apellidos,
          "idClub": user?.idclub,
          "ciUser": ci,
          "celular": celular,
          "password": ''
        }
        const result = await api.editUsuario(info);
        if(result.ok){
          setUser({...user,'correo':correo??'','nombres':nombres??'','apellido':apellidos??'',
            'cedula':ci ?? 0,
            'celular':celular ?? 0,
            nombreclub: user?.nombreclub ?? 'Sin Club', 
            latitud: user?.latitud ?? 0,
            longitud: user?.longitud ?? 0,
            idclub: user?.idclub ?? 0})
          router.back()
        }else{
          ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);  
        }
      } else {
        ToastAndroid.showWithGravity("No se permite campos vacios en nombre, apellido y correo.", ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado';
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } finally{
      setLoading(false);
    }
  }
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contaihead}>
        <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>Modificar Datos</ThemedText>
        <ThemedView style={styles.contbtn}>
          <ThemedButton
            icon="close"
            iconSet="material"
            onPress={() => router.back()}
            title="SALIR"
            style={styles.btnfail}
          />
          <ThemedButton
            icon="done"
            iconSet="material"
            onPress={() => saveInformacion()}
            title="GUARDAR"
            style={styles.btnok}
          />
        </ThemedView>
      </ThemedView>
      <ScrollableView>
        <ThemedView style={styles.contform}>
          <ThemedView style={styles.contFormC}>
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>Nombres</ThemedText>
          </ThemedView>
          <ThemedTextInput
            placeholder="Nombres"
            type="outlined"
            value={nombres}
            onChangeText={(val) => setNombres(val.replace(/[^a-zA-Z ]/g, '').toLocaleUpperCase())}
            style={styles.textInput} />
        </ThemedView>
        <ThemedView style={styles.contform}>
          <ThemedView style={styles.contFormC}>
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>Apellidos</ThemedText>
          </ThemedView>
          <ThemedTextInput
            placeholder="Apellidos"
            keyboardType='default'
            type="outlined"
            value={apellidos}
            onChangeText={(val) => setApellidos(val.replace(/[^a-zA-Z ]/g, '').toLocaleUpperCase())}
            style={styles.textInput} />
        </ThemedView>
        <ThemedView style={styles.contform}>
          <ThemedView style={styles.contFormC}>
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>Correo </ThemedText>
          </ThemedView>
          <ThemedTextInput
            placeholder="Correo"
            type="outlined"
            value={correo}
            onChangeText={(val) => setCorreo(val.toLocaleLowerCase())}
            style={styles.textInput} />
        </ThemedView>
        <ThemedView style={styles.contform}>
          <ThemedView style={styles.contFormC}>
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>CI</ThemedText>
          </ThemedView>
          <ThemedTextInput
            placeholder="ci"
            keyboardType='numeric'
            type="outlined"
            value={ci?.toString()}
            onChangeText={(val) => {
              if (val === '') {
                setCi(undefined);
                return;
              }
              const numero = Number(val);
              if (!isNaN(numero)) {
                setCi(numero);
              }
            }}
            style={styles.textInput} />
        </ThemedView>
        <ThemedView style={styles.contform}>
          <ThemedView style={styles.contFormC}>
            <ThemedText type="defaultSemiBold" style={{ textAlign: 'center' }}>Celular</ThemedText>
          </ThemedView>
          <ThemedTextInput
            placeholder="celular"
            keyboardType='numeric'
            type="outlined"
            value={celular?.toString()}
            onChangeText={(val) => {
              if (val === '') {
                setCelular(undefined);
                return;
              }
              const numero = Number(val);
              if (!isNaN(numero)) {
                setCelular(numero);
              }
            }}
            style={styles.textInput} />
        </ThemedView>
      </ScrollableView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    alignItems: 'center',
  },
  contaihead: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    width: '100%',
  },
  contbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    //backgroundColor: '#585858a2',
    padding: 3,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  btnfail: {
    width: '50%',
    height: 45,
    marginBottom: 10,
    backgroundColor: '#884134ff',
  },
  btnok: {
    width: '50%',
    height: 45,
    marginBottom: 10,
    backgroundColor: '#3e8834ff',
  },
  contform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    justifyContent: 'center',
  },
  contFormC: {
    flexDirection: 'column',
    width: '30%',
  },
  textInput: {
    width: '65%',
    height: 45,
    marginBottom: 10,
  },
});
