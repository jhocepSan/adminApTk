import ScrollableView from '@/components/contenedor-scroll-view'
import MapaLeaflet from '@/components/mapa-leaftlet'
import { ThemedButton } from '@/components/themed-buton-icon'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { imgEdit } from '@/constants/typesdata'
import { useAppContext } from '@/context/context-aplication'
import store from '@/restapi/store'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Alert, StatusBar, StyleSheet, Text, ToastAndroid, View } from 'react-native'

export default function Perfil() {
    const { setUser, setIsLogin, user } = useAppContext();
    const router = useRouter();
    const cerrarEliminarUsuario = async () => {
        try {
            await store.clearKey();
            setIsLogin(false);
            setUser(null);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado';
            ToastAndroid.show(message, ToastAndroid.SHORT);
        }
    }
    function cerrarUsuario() {
        return (
            Alert.alert(
                'Cerrar sesión',
                '¿Estás seguro que deseas salir?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Salir', style: 'destructive',
                        onPress: () => cerrarEliminarUsuario()
                    },
                ]
            )
        )
    }
    function goRoot(ruta: string, info: imgEdit) {
        router.push({
            pathname: `/${ruta}` as any,
            params: { ...info }
        });
    }
    return (
        <ThemedView style={styles.container}>
            {/* HEADER ÚNICO CORREGIDO */}
            <ThemedView style={styles.header}>
                <Image
                    source={require('@/assets/images/tk-welcome.png')}
                    style={styles.imagenPerfil}
                />

                <View style={styles.userInfoContainer}>
                    <View style={styles.nameSection}>
                        <ThemedText type="title" style={styles.apellidoText}>
                            {user?.apellido || 'Apellido'}
                        </ThemedText>
                        <ThemedText style={styles.nombreText}>
                            {user?.nombres || 'Nombre'}
                        </ThemedText>
                    </View>

                    <View style={styles.clubBadge}>
                        <Text style={styles.clubText}>
                            {user?.nombreclub || 'Sin Club'}
                        </Text>
                    </View>
                </View>

                {/* BOTÓN DE LOGOUT */}
                <ThemedButton
                    icon="logout"
                    iconSet="material"
                    onPress={() => cerrarUsuario()}
                    title=""
                    style={styles.logoutIconButton}
                />
            </ThemedView>

            <ScrollableView >
                <ThemedView style={styles.menuContainer}>
                    <ThemedButton
                        icon="account-box"
                        iconSet="material"
                        onPress={() => goRoot('editusuario', { 'id': 0, 'tipo': '' })}
                        title="Modificar Datos"
                        style={styles.btnEditUser}
                    />
                    <ThemedButton
                        icon="camera-alt"
                        iconSet="material"
                        onPress={() => goRoot('changeimg', { 'id': user?.id ?? 0, 'tipo': 'U' })}
                        title="Cambiar Foto"
                        style={styles.btnEditUser}
                    />
                    <ThemedButton
                        icon="fmd-good"
                        iconSet="material"
                        onPress={() => goRoot('positionmap', { 'id': user?.id ?? 0, 'tipo': 'C' })}
                        title="Cambiar Ubicación"
                        style={styles.btnEditUser}
                    />

                    <View style={styles.mapWrapper}>
                        <MapaLeaflet />
                    </View>
                </ThemedView>
            </ScrollableView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight || 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    imagenPerfil: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: '#214950ff',
    },
    userInfoContainer: {
        flex: 1, // Esto es vital para que el nombre tome el espacio central
        marginLeft: 12,
        justifyContent: 'center',
    },
    nameSection: {
        marginBottom: 2,
    },
    apellidoText: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    nombreText: {
        fontSize: 15,
        opacity: 0.7,
        color: '#666'
    },
    clubBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#21495015',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    clubText: {
        fontSize: 11,
        color: '#214950ff',
        fontWeight: 'bold',
    },
    logoutIconButton: {
        width: 50,
        height: 50,
        borderRadius: 22,
        backgroundColor: '#a81313',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    menuContainer: {
        padding: 3,
    },
    btnEditUser: {
        width: '100%',
        height: 50,
        marginBottom: 10,
        backgroundColor: '#214950ff',
        borderRadius: 10,
    },
    mapWrapper: {
        height: '80%',
        borderRadius: 15,
        overflow: 'hidden',
        marginTop: 1,
    },
    containerScroll: {
        paddingBottom: 40,
    }
});
