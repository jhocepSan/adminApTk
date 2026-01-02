import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ThemedButton } from './themed-buton-icon';
import { ThemedText } from './themed-text';
import { ThemedTextInput } from './themed-text-input';

interface FormProps {
  initialData?: any;
  onSave: (data: any) => void;
  clubes: { nombre: string; abreviado: string; idclub: any }[]; // Lista para el selector
  cinturones: { nombre: string; color: string; idcinturon: any }[];
}



export function FormularioDocente({ initialData, onSave, clubes, cinturones }: FormProps) {
  const [form, setForm] = useState({
    iddocente: initialData?.iddocente || 0,
    nombres: initialData?.nombres || '',
    apellidos: initialData?.apellidos || '',
    fecha_nac: initialData?.fecha_nac || '',
    edad: initialData?.edad || 0,
    especialidad: initialData?.especialidad || '',
    genero: initialData?.genero || 'M',
    ci: initialData?.ci || '',
    celular: initialData?.celular || '',
    idclub: initialData?.idclub || null,
    direccion: initialData?.direccion || '',
    idadjunto: initialData?.idadjunto || 0,
    idcinturon: initialData?.idcinturon || 0,
    idubicacion: initialData?.idubicacion || 0,
    latitud: initialData?.latitud||0,
    longitud: initialData?.longitud||0,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const calcularEdad = (fechaNacimiento: Date) => {
    const hoy = new Date();
    const cumple = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const mes = hoy.getMonth() - cumple.getMonth();

    // Ajuste por si aún no ha cumplido años en el año actual
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    return edad;
  };
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // En iOS se mantiene abierto
    if (selectedDate) {
      setDate(selectedDate);
      const edad = calcularEdad(selectedDate)
      console.log(edad)
      setForm({ ...form, fecha_nac: selectedDate.toISOString().split('T')[0], edad: edad });
    }
  };
  const _renderItem = (item: any) => {
    return (
      <View style={styles.itemCustom}>
        <ThemedText style={styles.textItem}>{item.nombre}</ThemedText>
        <ThemedText style={styles.textItem}>{item.abreviado}</ThemedText>
        {item.idclub === form.idclub && (
          <View style={styles.selectedIcon} /> // Opcional: Un punto o check
        )}
      </View>
    );
  };
  const _renderCintu = (item: any) => {
    return (
      <View style={styles.itemCustom}>
        <ThemedText style={styles.textItem}>{item.nombre}</ThemedText>
        <ThemedText style={[styles.textItem, { fontSize: 11, opacity: 10, color: '#9c9a9ad8' }]}>({item.colores})</ThemedText>
        {item.idcinturon === form.idcinturon && (
          <View style={styles.selectedIcon} /> // Opcional: Un punto o check
        )}
      </View>
    );
  };
  function goRoot(ruta: string, info: any) {
    router.push({
      pathname: `/${ruta}` as any,
      params: { ...info }
    });
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <ThemedText style={styles.label}>Información Personal</ThemedText>
        <ThemedTextInput
          style={{ marginBottom: 5 }}
          placeholder="Nombres"
          type='outlined'
          value={form.nombres}
          onChangeText={(t) => setForm({ ...form, nombres: t.toUpperCase() })}
        />
        <ThemedTextInput
          placeholder="Apellidos"
          type='outlined'
          value={form.apellidos}
          onChangeText={(t) => setForm({ ...form, apellidos: t.toUpperCase() })}
        />
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <ThemedText style={styles.subLabel}>Fecha Nacimiento</ThemedText>
                <ThemedTextInput
                  placeholder="YYYY-MM-DD"
                  type="outlined"
                  value={form.fecha_nac}
                  editable={false} // IMPORTANTE: Para que solo se use el picker
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.subLabel}>Edad</ThemedText>
                <ThemedTextInput keyboardType="numeric"
                  type='outlined' value={form.edad.toString()} editable={false} />
              </View>
            </View>
          </View>
        </Pressable>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            maximumDate={new Date()} // No permite fechas futuras
          />
        )}
        <View style={styles.row}>
          <View style={{ flex: 1, marginRight: 10 }}>
            <ThemedText style={styles.subLabel}>C.I.</ThemedText>
            <ThemedTextInput keyboardType="numeric" type='outlined' value={form.ci} onChangeText={(t) => setForm({ ...form, ci: t })} />
          </View>
          <View style={{ flex: 1 }}>
            <ThemedText style={styles.subLabel}>Celular</ThemedText>
            <ThemedTextInput keyboardType="phone-pad"
              type='outlined' value={form.celular} onChangeText={(t) => setForm({ ...form, celular: t })} />
          </View>
        </View>
        <ThemedText style={styles.subLabel}>Género</ThemedText>
        <View style={styles.genderContainer}>
          {['M', 'F'].map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.genderBtn, form.genero === g && styles.genderBtnActive]}
              onPress={() => setForm({ ...form, genero: g })}
            >
              <ThemedText style={{ color: form.genero === g ? '#fff' : '#666' }}>
                {g === 'M' ? 'Masculino' : 'Femenino'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <ThemedText style={styles.label}>Perfil Académico</ThemedText>
        <ThemedTextInput
          placeholder="Especialidad (Ej. Kirougui)"
          type='outlined'
          value={form.especialidad}
          onChangeText={(t) => setForm({ ...form, especialidad: t })}
        />
        <ThemedText style={styles.subLabel}>Club</ThemedText>
        <Dropdown
          style={[styles.dropdown, { backgroundColor: 'rgba(255,255,255,0.05)' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainer}
          itemTextStyle={styles.itemText}
          activeColor="#214950"
          data={clubes} // Usa la prop que ya recibes
          labelField="nombre"
          renderItem={_renderItem}
          valueField="idclub"
          placeholder="Seleccione un club"
          value={form.idclub}
          onChange={item => {
            setForm({ ...form, idclub: item.idclub });
          }}
        />
        <ThemedText style={styles.subLabel}>Cinturón</ThemedText>
        <Dropdown
          style={[styles.dropdown, { backgroundColor: 'rgba(255, 255, 255, 0.16)' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainer}
          itemTextStyle={styles.itemText}
          activeColor="#214950"
          data={cinturones} // Usa la prop que ya recibes
          labelField="nombre"
          renderItem={_renderCintu}
          valueField="idcinturon"
          placeholder="Seleccione un Cinturon"
          value={form.idcinturon}
          onChange={item => {
            setForm({ ...form, idcinturon: item.idcinturon });
          }}
        />
      </View>

      <View style={styles.card}>
        <ThemedText style={styles.label}>Multimedia y Ubicación</ThemedText>

        <View style={styles.row}>
          <ThemedButton
            title="Foto"
            icon="camera"
            style={styles.actionBtn}
            onPress={() => console.log("Cargar Imagen")}
          />
          <ThemedButton
            title="Mapa"
            icon="location"
            style={{ ...styles.actionBtn, backgroundColor: '#214950' }}
            onPress={() => goRoot('positionmap',{id:initialData?.idubicacion,'tipo':'D'})}
          />
        </View>

        <ThemedTextInput
          placeholder="Descripción de la ubicación..."
          type='outlined'
          multiline
          numberOfLines={3}
          value={form.direccion}
          onChangeText={(t) => setForm({ ...form, direccion: t })}
          style={styles.textArea}
        />
      </View>

      <ThemedButton
        icon="save"
        title="GUARDAR DOCENTE"
        onPress={() => onSave(form)}
        style={styles.submitBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 30 },
  card: {
    backgroundColor: '#6d6d6d44', // Tu color personalizado
    padding: 9,
    borderRadius: 10,
    marginBottom: 5,
  },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#fff' },
  subLabel: { fontSize: 12, color: '#ccc', marginBottom: 5, marginTop: 10 },
  row: { flexDirection: 'row', gap: 10, marginBottom: 0 },
  genderContainer: { flexDirection: 'row', gap: 10, marginTop: 5 },
  genderBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center'
  },
  genderBtnActive: { backgroundColor: '#214950' },
  actionBtn: { flex: 1, height: 45 },
  textArea: { height: 80, textAlignVertical: 'top', marginTop: 10 },
  submitBtn: { height: 55, borderRadius: 12, backgroundColor: '#34C759' },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
  },
  itemCustom: {
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2c2c2c', // Fondo de la fila
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 5
  },
  // Texto de la fila
  textItem: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
  },
  // Estilo del dropdown cerrado
  dropdown: {
    height: 55,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  // El contenedor de TODA la lista desplegable
  dropdownContainer: {
    backgroundColor: '#2c2c2c',
    borderRadius: 12,
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#444',
    overflow: 'hidden', // Evita que los items se salgan de las esquinas redondeadas
  },
  // Estilo del texto cuando está seleccionado
  selectedTextStyle: {
    fontSize: 15,
    color: '#fff',
    fontWeight: '500',
  },
  selectedIcon: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#34C759', // Verde éxito
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5, // Sombra en Android
  },
});
