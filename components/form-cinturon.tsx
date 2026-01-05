import { cinturonType } from '@/constants/typesdata';
import { useAppContext } from '@/context/context-aplication';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedTextInput } from './themed-text-input';


interface Props {
    initialData?: cinturonType | null;
    onSave: (data: any) => void;
    editar?: boolean;
}

export function FormularioCinturon({ initialData, onSave, editar = true }: Props) {
    const {user} = useAppContext();
    const [form, setForm] = useState({
        idcinturon:initialData?.idcinturon||0,
        idclub:initialData?.idclub||user?.idclub,
        nombre: initialData?.nombre||'',
        colores: initialData?.colores||'',
    });


    return (
        <View style={styles.container}>
            <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Nombre del Cinturón</ThemedText>
                <ThemedTextInput
                    placeholder="Ej. 1kup, 2kup, 3kup,..."
                    value={form.nombre}
                    editable={editar}
                    onChangeText={(t) => setForm({ ...form, nombre: t })}
                    type="outlined"
                />
            </View>

            <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Colores / Descripción</ThemedText>
                <ThemedTextInput
                    placeholder="Ej. Blanco sólido, franja amarilla"
                    value={form.colores}
                    editable={editar}
                    onChangeText={(t) => setForm({ ...form, colores: t })}
                    type="outlined"
                    multiline
                    numberOfLines={2}
                />
            </View>

            {editar && (
                <TouchableOpacity 
                    style={styles.btnGuardar} 
                    onPress={() => onSave(form)}
                >
                    <ThemedText style={styles.btnText}>Guardar Cinturón</ThemedText>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 10 },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 14, marginBottom: 5, fontWeight: '600', opacity: 0.8 },
    btnGuardar: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});
