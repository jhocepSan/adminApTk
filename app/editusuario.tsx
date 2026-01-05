import ScrollableView from '@/components/contenedor-scroll-view';
import { ThemedButton } from '@/components/themed-buton-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { imgEdit } from '@/constants/typesdata';
import { useAppContext } from '@/context/context-aplication';
import api from '@/restapi/api';
import { router } from 'expo-router';
import { useState } from 'react';
import { StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';

export default function EditUsuario() {
  const { user, setLoading, setUser,infoHelp,setInfoHelp } = useAppContext();
  const [info, setInfo] = useState({
    id: user?.id || 0,
    nombres: user?.nombres || '',
    apellidos: user?.apellidos || '',
    nombreclub: user?.nombreclub || '',
    correo: user?.correo || '',
    latitud: user?.latitud || 0,
    longitud: user?.longitud || 0,
    cedula: user?.cedula || 0,
    celular: user?.celular || 0,
    idclub: user?.idclub || 0,
    foto: user?.foto || '',
    idadjunto: user?.idadjunto || 0,
    idubicacion: user?.idubicacion || 0,
    direccion:user?.direccion ||'',
  })
  
  const saveInformacion = async () => {
    try {
      setLoading(true);
      if (info.apellidos !== '' && info.nombres !== '' && info.correo !== '') {
        const result = await api.editUsuario({...info,...infoHelp});
        if (result.ok) {
          console.log(result);
          setInfoHelp(null);
          setUser({...info,...infoHelp});
          router.back()
        } else {
          ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
        }
      } else {
        ToastAndroid.showWithGravity("No se permite campos vacios en nombre, apellido y correo.", ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado';
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  }
  function goRoot(ruta: string, info: imgEdit) {
    router.push({
      pathname: `/${ruta}` as any,
      params: { ...info }
    });
  }
  return (
    <ThemedView style={styles.container}>
      {/* HEADER TIPO TOOLBAR */}
      <ThemedView style={styles.header}>
        <ThemedButton
          icon="close"
          iconSet="material"
          onPress={() => router.back()}
          title="" // Solo icono para limpiar el header
          style={styles.btnIconOnly}
        />
        <ThemedText type="subtitle" style={styles.headerTitle}>Editar Perfil</ThemedText>
        <ThemedButton
          icon="done"
          iconSet="material"
          onPress={() => saveInformacion()}
          title=""
          style={{ ...styles.btnIconOnly, ...styles.btnSave }}
        />
      </ThemedView>

      <ScrollableView>

        {/* GRUPO DE INPUTS: DISEÑO VERTICAL */}
        <ThemedView style={styles.formSection}>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Nombres</ThemedText>
            <ThemedTextInput
              placeholder="Ej. Juan"
              type="outlined"
              value={info.nombres}
              onChangeText={(val) => setInfo({ ...info, nombres: val.replace(/[^a-zA-Z ]/g, '').toLocaleUpperCase() })}
              style={styles.fullWidthInput}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Apellidos</ThemedText>
            <ThemedTextInput
              placeholder="Ej. Perez"
              type="outlined"
              value={info.apellidos}
              onChangeText={(val) => setInfo({ ...info, apellidos: val.replace(/[^a-zA-Z ]/g, '').toLocaleUpperCase() })}
              style={styles.fullWidthInput}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Correo Electrónico</ThemedText>
            <ThemedTextInput
              placeholder="correo@ejemplo.com"
              keyboardType="email-address"
              type="outlined"
              value={info.correo}
              onChangeText={(val) => setInfo({ ...info, correo: val.toLocaleLowerCase() })}
              style={styles.fullWidthInput}
            />
          </ThemedView>

          <View style={styles.rowInputs}>
            <ThemedView style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <ThemedText style={styles.label}>C.I.</ThemedText>
              <ThemedTextInput
                placeholder="Documento"
                keyboardType='numeric'
                type="outlined"
                value={info.cedula.toString()}
                onChangeText={(val) => setInfo({ ...info, cedula: parseInt(val) })}
                style={styles.fullWidthInput}
              />
            </ThemedView>

            <ThemedView style={[styles.inputGroup, { flex: 1 }]}>
              <ThemedText style={styles.label}>Celular</ThemedText>
              <ThemedTextInput
                placeholder="Número"
                keyboardType='numeric'
                type="outlined"
                value={info.celular.toString()}
                onChangeText={(val) => setInfo({ ...info, celular: Number(val) })}
                style={styles.fullWidthInput}
              />
            </ThemedView>
          </View>
          <View style={styles.rowInputs}>
            <ThemedButton
              icon="camera-alt"
              iconSet="material"
              onPress={() => goRoot('changeimg', { 'id': info.idadjunto, 'tipo': 'U' })}
              title="Cambiar Foto"
              style={styles.btnEditMul}
            />
            <ThemedButton
              icon="fmd-good"
              iconSet="material"
              onPress={() => goRoot('positionmap', { 'id': info.idubicacion, 'tipo': 'C' })}
              title="Ubicación"
              style={styles.btnEditMul}
            />
          </View>
          <ThemedTextInput
            placeholder="Descripción de la ubicación del club..."
            type='outlined'
            multiline
            numberOfLines={3}
            value={info.direccion}
            onChangeText={(t) => setInfo({ ...info, direccion: t })}
            style={styles.textArea}
          />
        </ThemedView>

        <ThemedButton
          icon='save'
          onPress={() => saveInformacion()}
          title="GUARDAR CAMBIOS"
          style={styles.btnMainAction}
        />
      </ScrollableView>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    backgroundColor: '#0000005b', // Un fondo claro hace que el formulario se vea más limpio
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingVertical: 5,
    backgroundColor: '#214950', // Usamos tu color principal (oscuro)
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF', // Texto de la cabecera siempre blanco
  },
  btnIconOnly: {
    width: 50, // Un poco más grande para dar margen
    height: 50,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center', // Centrado vertical
    alignItems: 'center',     // Centrado horizontal
    padding: 0,               // IMPORTANTE: Elimina cualquier padding interno
    overflow: 'hidden',       // Evita que el icono "pise" los bordes
  },
  btnSave: {
    backgroundColor: '#34C759', // Verde sólido brillante para que el "check" sea visible
  },
  formSection: {
    backgroundColor: '#6d6d6d44',
    borderRadius: 20,
    padding: 10,
    margin: 10, // Separamos el formulario de los bordes
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2b6f7aff',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 6,
    backgroundColor: '#6d6d6d0c'
  },
  fullWidthInput: {
    width: '100%',
    height: 50,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnMainAction: {
    width: '100%',
    height: 55,
    borderRadius: 12,
    backgroundColor: '#214950ff',
    shadowColor: '#214950',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  btnEditMul: {
    width: '48%',
    height: 50,
    marginBottom: 10,
    backgroundColor: '#214950ff',
    borderRadius: 10,
  },
  textArea: { height: 80, textAlignVertical: 'top'},
});
