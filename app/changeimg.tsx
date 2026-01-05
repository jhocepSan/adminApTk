import { DEFAULT_AVATAR, IconSet } from '@/constants/typesdata';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
type SearchParams = {
    id: number;
    tipo: string;
};


function RenderIcon({
    icon,
    iconSet,
    color,
    size,
}: {
    icon: any;
    iconSet: IconSet;
    color: string;
    size: number;
}) {
    if (iconSet === 'material') {
        return <MaterialIcons name={icon} size={size} color={color} />;
    }

    return <Ionicons name={icon} size={size} color={color} />;
}


const ChangeImg = () => {
    const { id, tipo } = useLocalSearchParams() as unknown as SearchParams;
    const [imagen, setImagen] = useState<string | null>(null);

    const saveImages = async () => {
        try {
            console.log(imagen)
            
        } catch (error) {

        } finally {

        }
    }
    // Función para abrir la GALERÍA
    const seleccionarDesdeGaleria = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Error', 'Se requieren permisos para acceder a la galería.');
            return;
        }

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // Solo imágenes en 2025
            allowsEditing: true,    // Permite recortar
            aspect: [3, 6],
            quality: 1,
        });

        if (!resultado.canceled) {
            setImagen(resultado.assets[0].uri);
        }
    };

    // Función para usar la CÁMARA
    const tomarFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Error', 'Se requieren permisos para la cámara.');
            return;
        }

        const resultado = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
        });

        if (!resultado.canceled) {
            setImagen(resultado.assets[0].uri);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={{ uri: imagen || DEFAULT_AVATAR }} style={styles.imgcont} resizeMode="contain" />
            <View style={styles.contbuttons}>
                <View style={styles.columnas}>
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.button}
                    >
                        <RenderIcon
                            icon={'clear'}
                            iconSet={'material'}
                            color={'#fff'}
                            size={45} />
                    </Pressable>
                </View>
                <View style={styles.columnas}>
                    <Pressable
                        onPress={tomarFoto}
                        style={styles.button}
                    >
                        <RenderIcon
                            icon={'camera'}
                            iconSet={'material'}
                            color={'#fff'}
                            size={45} />
                    </Pressable>
                </View>
                <View style={styles.columnas}>
                    <Pressable
                        onPress={seleccionarDesdeGaleria}
                        style={styles.button}
                    >
                        <RenderIcon
                            icon={'filter'}
                            iconSet={'material'}
                            color={'#fff'}
                            size={45} />
                    </Pressable>
                </View>
                {imagen && <View style={styles.columnas}>
                    <Pressable
                        onPress={saveImages}
                        style={styles.button}
                    >
                        <RenderIcon
                            icon={'save-as'}
                            iconSet={'material'}
                            color={'#fff'}
                            size={45} />
                    </Pressable>
                </View>}
            </View>
        </SafeAreaView>
    )
}

export default ChangeImg

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        borderRadius: 100, // Valor numérico para círculo
        borderColor: '#fff',
        borderWidth: 1,
        padding: 8, // Espacio entre el icono y el borde
        alignItems: 'center',
        justifyContent: 'center',
        aspectRatio: 1,
    },
    imgcont: {
        width: '100%',
        height: '90%',
        marginVertical: 1,
    },
    contbuttons: {
        height: '10%', // Aumentamos de 10% a 15% para mejor manejo táctil
        flexDirection: 'row',
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'space-evenly', // Distribuye los botones equitativamente
        paddingHorizontal: 10,
    },
    columnas: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }
})