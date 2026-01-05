import { useAppContext } from '@/context/context-aplication';
import { useThemeColor } from '@/hooks/use-theme-color';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { DIAS_SEMANA, horarioType } from '../constants/typesdata';
import ApiRes from '../restapi/api';
import { ThemedLoader } from './themed-loading';
import { ThemedText } from './themed-text';
import { ThemedTextInput } from './themed-text-input';

interface Props {
    initialData?: any;
    onAgregar: (horario: horarioType) => void;
    editando?: boolean;
    lightColor?: string;
    darkColor?: string;
}

const activeColor = '#007AFF';

export function FormularioHorario({
    initialData,
    editando,
    onAgregar,
    lightColor,
    darkColor }: Props) {
    const { user, setLoading, loading } = useAppContext();
    const [horario, setHorario] = useState<horarioType>({
        idhorario: initialData?.idhorario || 0,
        idclub: initialData?.idclub || user?.idclub,
        idperiodo: initialData?.idperiodo || 0,
        dia: initialData?.dia || '',
        iddocente: initialData?.iddocente || 0,
        limite_alumnos: initialData?.limite_alumnos || 0,
        cant_alumnos: initialData?.cant_alumnos || 0,
        descripcion: initialData?.descripcion || '',
        activo: initialData?.activo || 1,
        hora_ini: initialData?.hora_ini || '',
        hora_fin: initialData?.hora_fin || '',
        nombre_docente:initialData?.nombre_docente||'',
    });
    const [docentes, setDocentes] = useState([]);
    const [picker, setPicker] = useState<{ show: boolean, field: 'hora_ini' | 'hora_fin' }>({
        show: false,
        field: 'hora_ini'
    });
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    const textColor = useThemeColor({ light: '#111111', dark: '#ffffff' }, 'text');
    const diasSemana = DIAS_SEMANA;

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        setPicker({ ...picker, show: Platform.OS === 'ios' });
        if (selectedDate) {
            const horas = String(selectedDate.getHours()).padStart(2, '0');
            const minutos = String(selectedDate.getMinutes()).padStart(2, '0');
            setHorario({ ...horario, [picker.field]: `${horas}:${minutos}` });
        }
    };
    const getDocentes = async () => {
        try {
            setLoading(true);
            const result = await ApiRes.getDocentes({ 'idclub': user?.idclub });
            if (result.ok) {
                setDocentes(result.ok);
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
    useEffect(() => {
        getDocentes()
    }, [])
    return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.container, { backgroundColor }]}>
            <ThemedText style={styles.label}>Día de la semana</ThemedText>
            <View style={styles.diasContainer}>
                {diasSemana.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.diaBtn, horario.dia === item.id && styles.diaBtnActive]}
                        onPress={() => setHorario({ ...horario, dia: item.id })}
                    >
                        <ThemedText style={horario.dia === item.id ? styles.textActive : {}}>{item.label.substring(0, 2)}</ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    style={styles.timeInput}
                    onPress={() => setPicker({ show: true, field: 'hora_ini' })}
                >
                    <ThemedText style={styles.subLabel}>Inicio</ThemedText>
                    <ThemedText style={styles.timeText}>{horario.hora_ini}</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.timeInput}
                    onPress={() => setPicker({ show: true, field: 'hora_fin' })}
                >
                    <ThemedText style={styles.subLabel}>Fin</ThemedText>
                    <ThemedText style={styles.timeText}>{horario.hora_fin}</ThemedText>
                </TouchableOpacity>
            </View>

            <ThemedText style={styles.subLabel}>Límite de Alumnos</ThemedText>
            <ThemedTextInput
                keyboardType="numeric"
                value={horario.limite_alumnos.toString()}
                onChangeText={(t) => setHorario({ ...horario, limite_alumnos: parseInt(t) || 0 })}
            />

            <ThemedText style={styles.subLabel}>Descripción</ThemedText>
            <ThemedTextInput
                placeholder="Descripción ..."
                type='outlined'
                multiline
                numberOfLines={3}
                value={horario.descripcion}
                onChangeText={(t) => setHorario({ ...horario, descripcion: t })}
                style={styles.textArea}
                //editable={editando ? false : true}
            />
            <ThemedText style={styles.subLabel}>Seleccione Docente</ThemedText>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {docentes.map((item:any,index) => {
                    const esActivo = horario?.iddocente === item?.iddocente;
                    return (
                        <Pressable
                            key={index} // Usa label o un ID único
                            onPress={() => setHorario({...horario,iddocente:item.iddocente})}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: esActivo ? activeColor : backgroundColor,
                                    height: esActivo ? 65 : 55,
                                    borderColor: esActivo ? activeColor : '#ddd'
                                },
                            ]}
                        >
                            <View style={styles.content}>
                                <Text style={[styles.texto, { color: esActivo ? '#fff' : textColor }]}>
                                    {item.nombres} {item.apellidos}
                                </Text>
                                <Text style={[styles.texto, { color: esActivo ? '#fff' : textColor }]}>
                                    Especialidad: {item.especialidad} 
                                </Text>
                                <Text style={[styles.texto, { color: esActivo ? '#fff' : textColor }]}>
                                    Cinturon: {item.cinturon} 
                                </Text>
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
            <TouchableOpacity style={styles.btnAdd}
                onPress={() => onAgregar(horario)}>
                <ThemedText style={styles.textAdd}>Agregar Horario</ThemedText>
            </TouchableOpacity>

            {picker.show && (
                <DateTimePicker
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    value={new Date()}
                    onChange={handleTimeChange}
                />
            )}
            <ThemedLoader
                visible={loading} fullscreen
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 15, borderRadius: 10 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
    subLabel: { fontSize: 12, opacity: 0.7 },
    diasContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
    diaBtn: { padding: 8, borderRadius: 5, backgroundColor: '#9b999994' },
    diaBtnActive: { backgroundColor: '#214950' },
    textActive: { color: 'white', fontWeight: 'bold' },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 },
    timeInput: { flex: 0.48, padding: 10, backgroundColor: '#9b999994', borderRadius: 8 },
    timeText: { fontSize: 18, fontWeight: '500' },
    btnAdd: { backgroundColor: '#4caf4fbb', padding: 12, borderRadius: 8, marginTop: 15, alignItems: 'center' },
    textAdd: { color: 'white', fontWeight: 'bold' },
    textArea: { height: 80, textAlignVertical: 'top', marginTop: 10 },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        gap: 2, // Espaciado entre días
        paddingVertical: 5,
    },
    card: {
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
    content: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    texto: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    icono: {
        marginLeft: 6,
    },
});
