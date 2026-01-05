import { AlertBlock } from '@/components/alert-bloque';
import { CinturonCard } from '@/components/card-cinturon';
import { FormularioCinturon } from '@/components/form-cinturon';
import { BaseModal } from '@/components/modal-comp';
import { ThemedLoader } from '@/components/themed-loading';
import { ThemedText } from '@/components/themed-text';
import { cinturonType } from '@/constants/typesdata';
import { useAppContext } from '@/context/context-aplication';
import api from '@/restapi/api';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, ToastAndroid, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function Configurar() {
    const { user, loading, setLoading } = useAppContext();
    const [cinturones, setCinturones] = useState<cinturonType[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectCinturon, setSelectCinturon] = useState<cinturonType | null>(null);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const scale = useSharedValue(1);
    const rotation = useSharedValue(0);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value }, // Mantiene el pulso
            { rotate: `${rotation.value}deg` } // Añade rotación
        ],
    }));
    const guardarCinturon = async (dato:any) => {
        try {
            setLoading(true);
            const result = await api.agregarCinturon(dato);
            if (result.ok){
                setShowModal(false);
                setSelectCinturon(null);
                getListaCinturones();
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
    const editarEstadoCinturon =async(info:any)=>{
        try {
            setLoading(true);
            const result = await api.editarEstadoCinturon(info);
            if (result.ok){
                setShowModal(false);
                setSelectCinturon(null);
                getListaCinturones();
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
    const getListaCinturones = async () => {
        try {
            setLoading(true);
            const result = await api.getCinturones({idclub:user?.idclub});
            if (result.ok) {
                setCinturones(result.ok);
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
        getListaCinturones()
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
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <ThemedText style={styles.label}>Cinturones</ThemedText>
                    {cinturones.length !== 0 ? (
                        cinturones.map((item, index) => {
                            return (
                                <CinturonCard key={index} info={item}
                                    onPress={() => { setIsEdit(false); setSelectCinturon(item); setShowModal(true) }}
                                    onEdit={(dato) => { setIsEdit(true); setSelectCinturon(dato); setShowModal(true) }}
                                    onDelete={(dato)=>editarEstadoCinturon(dato)}
                                    onInactivate={(dato)=>editarEstadoCinturon(dato)}
                                />
                            )
                        })
                    ) : (
                        <AlertBlock type="empty"
                            message="Sin registros"
                            description="No se encontraron cinturones registrados a este club actualmente."
                            style={{ marginTop: 2 }} />
                    )}
                </View>
            </ScrollView>
            <BaseModal visible={showModal} onClose={() => setShowModal(false)} onSave={() => { }}
                title={`Estudiante`} showFooter={false}>
                <FormularioCinturon
                    editar={isEdit}
                    initialData={selectCinturon}
                    onSave={(data) => guardarCinturon(data)} />
            </BaseModal>
            <AnimatedPressable
                style={[
                    styles.fab,
                    animatedStyle, // Aquí aplicamos el pulso de zoom
                    // Mantenemos el efecto visual de cuando el usuario lo presiona
                ]}
                onPress={() => { setIsEdit(true); setSelectCinturon(null); setShowModal(true); }}
            >
                <Ionicons name="add" size={30} color="white" />
            </AnimatedPressable>
            <ThemedLoader
                visible={loading} fullscreen
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { paddingBottom: 10 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#fff', textAlign: 'center' },
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
    card: {
        backgroundColor: '#6d6d6d44', // Tu color personalizado
        padding: 9,
        borderRadius: 10,
        marginBottom: 5,
    },
})