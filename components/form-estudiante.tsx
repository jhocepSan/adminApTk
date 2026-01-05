import { DIAS_SEMANA } from '@/constants/typesdata';
import { useAppContext } from '@/context/context-aplication';
import { useThemeColor } from '@/hooks/use-theme-color';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import ApiRes from '../restapi/api';
import { ThemedButton } from './themed-buton-icon';
import { ThemedLoader } from './themed-loading';
import { ThemedText } from './themed-text';
import { ThemedTextInput } from './themed-text-input';

interface FormProps {
    initialData?: any;
    editar: boolean;
    onSave: (data: any) => void;
    cinturones: { nombre: string; color: string; idcinturon: any }[];
    lightColor?: string;
    darkColor?: string;
}

const activeColor = '#007AFF';

export function FormularioEstudiante({ initialData, editar, onSave,
    cinturones, lightColor, darkColor }: FormProps) {
    const { loading, setLoading, user } = useAppContext();
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const textColor = useThemeColor({ light: '#111111', dark: '#ffffff' }, 'text');
    const [form, setForm] = useState({
        idestudi: initialData?.idestudi || 0,
        iddato: initialData?.iddato || 0,
        idclub: initialData?.idclub || user?.idclub,
        idadjunto: initialData?.idadjunto || 0,
        idcinturon: initialData?.idcinturon || 0,
        idubicacion: initialData?.idubicacion || 0,
        idperiodo: initialData?.idperiodo || 0,
        estado: initialData?.estado || '',
        name_estado: initialData?.name_estado || 0,
        nombres: initialData?.nombres || '',
        apellidos: initialData?.apellidos || '',
        genero: initialData?.genero || 'M',
        fecha_nac: initialData?.fecha_nac || '',
        edad: initialData?.edad || 0,
        ci: initialData?.ci || '',
        dia: initialData?.dia || '',
        celular: initialData?.celular || '',
        direccion: initialData?.direccion || '',
        latitud: initialData?.latitud || 0,
        longitud: initialData?.longitud || 0,
    });
    const [horarios, setHorarios] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const router = useRouter();
    const [date, setDate] = useState(new Date(initialData?.fecha_nac));
    const scrollRef = useRef<ScrollView>(null);
    const [positions, setPositions] = useState<{[key: number]: number}>({});
    const diasSemana = DIAS_SEMANA;

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
    const getHorarios = async() => {
        try {
            setLoading(true);
            const result = await ApiRes.getHorarios({ idclub: user?.idclub, dia: form.dia });
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
    useEffect(() => {
        getHorarios()
    }, [form?.dia])
    useEffect(() => {
        if (form?.idperiodo && positions[form.idperiodo] !== undefined) {
            scrollRef.current?.scrollTo({
                x: positions[form.idperiodo],
                animated: true,
            });
        }
    }, [form?.idperiodo]);
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <ThemedText style={styles.label}>Información Personal</ThemedText>
                <ThemedTextInput
                    style={{ marginBottom: 5 }}
                    placeholder="Nombres"
                    type='outlined'
                    editable={editar ? true : false}
                    value={form.nombres}
                    onChangeText={(t) => setForm({ ...form, nombres: t.toUpperCase() })}
                />
                <ThemedTextInput
                    placeholder="Apellidos"
                    type='outlined'
                    editable={editar ? true : false}
                    value={form.apellidos}
                    onChangeText={(t) => setForm({ ...form, apellidos: t.toUpperCase() })}
                />
                <Pressable onPress={() => setShowDatePicker(editar ? true : false)}>
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
                        <ThemedTextInput keyboardType="numeric" type='outlined' editable={editar ? true : false}
                            value={form.ci} onChangeText={(t) => setForm({ ...form, ci: t })} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <ThemedText style={styles.subLabel}>Celular</ThemedText>
                        <ThemedTextInput keyboardType="phone-pad" editable={editar ? true : false}
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
                            disabled={editar ? false : true}
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

                <ThemedText style={styles.subLabel}>Cinturon</ThemedText>
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
                    disable={editar ? false : true}
                    onChange={item => {
                        setForm({ ...form, idcinturon: item.idcinturon });
                    }}
                />

                <ThemedText style={styles.subLabel}>Horario</ThemedText>
                <View style={styles.diasContainer}>
                    {diasSemana.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            disabled={editar ? false : true}
                            style={[styles.diaBtn, form?.dia === item.id && styles.diaBtnActive]}
                            onPress={() => setForm({ ...form, dia: item.id })}
                        >
                            <ThemedText style={initialData?.dia === item.id ? styles.textActive : {}}>{item.label.substring(0, 2)}</ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>
                <ScrollView
                    ref={scrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                    indicatorStyle="white" // Opciones: 'default', 'black', 'white' (Solo iOS)
                    persistentScrollbar={true} 
                >
                    {horarios.map((item: any, index) => {
                        const esActivo = form?.idperiodo === item?.idperiodo;
                        return (
                            <Pressable
                                key={item.idperiodo}
                                onLayout={(event) => {
                                    const { x } = event.nativeEvent.layout;
                                    // Guardamos la posición X asociada al ID del periodo
                                    setPositions(prev => ({ ...prev, [item.idperiodo]: x }));
                                }}
                                onPress={() => setForm({ ...form, idperiodo: item.idperiodo })}
                                style={[
                                    styles.cardHorario,
                                    {
                                        backgroundColor: esActivo ? activeColor : backgroundColor,
                                        height: esActivo ? 65 : 55,
                                        borderColor: esActivo ? activeColor : '#ddd'
                                    },
                                ]}
                                disabled={editar ? false : true}
                            >
                                <View style={styles.content}>
                                    <Text style={[styles.texto, { color: esActivo ? '#fff' : textColor }]}>
                                       Hora: {item.hora_ini} - {item.hora_fin}
                                    </Text>
                                    <Text 
                                        numberOfLines={1} 
                                        ellipsizeMode="tail"
                                        style={[styles.texto, { color: esActivo ? '#fff' : textColor }]}>
                                        Docente: {item.nombre_docente}
                                    </Text>
                                    <Text 
                                        numberOfLines={1} 
                                        ellipsizeMode="tail"
                                        style={[styles.texto, { color: esActivo ? '#fff' : textColor }]}>
                                        {item.descripcion}
                                    </Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            <View style={styles.card}>
                <ThemedText style={styles.label}>Multimedia y Ubicación</ThemedText>

                {editar &&
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
                            onPress={() => goRoot('positionmap', { id: form?.idubicacion, 'tipo': 'E' })}
                        />
                    </View>}

                <ThemedTextInput
                    placeholder="Descripción de la ubicación..."
                    type='outlined'
                    multiline
                    numberOfLines={3}
                    value={form.direccion}
                    onChangeText={(t) => setForm({ ...form, direccion: t })}
                    style={styles.textArea}
                    editable={editar ? true : false}
                />
            </View>

            {editar &&
                <ThemedButton
                    icon="save"
                    title="GUARDAR ESTUDIANTE"
                    onPress={() => onSave(form)}
                    style={styles.submitBtn}
                />}
            <ThemedLoader
                visible={loading} fullscreen
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { paddingBottom: 30 },
    diasContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    diaBtn: { padding: 8, borderRadius: 5, backgroundColor: '#9b999994' },
    diaBtnActive: { backgroundColor: '#275861ff' },
    textActive: { color: 'white', fontWeight: 'bold' },
    cardHorario: {
        paddingHorizontal: 10, 
        marginRight: 5, // Espacio entre cada tarjeta (más fiable que gap en ScrollView antiguos)
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // Sombra
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        gap: 2, // Espaciado entre días
        paddingVertical: 5,
    },
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
    submitBtn: { height: 55, borderRadius: 12, backgroundColor: '#34c759d2' },
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
    content: {
        flexDirection: 'column',
        alignItems: 'center',
        width:170,
    },
    texto: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});
