import ScrollableView from '@/components/contenedor-scroll-view'
import MapaLeaflet from '@/components/mapa-leaftlet'
import { ThemedButton } from '@/components/themed-buton-icon'
import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { imgEdit } from '@/constants/typesdata'
import { useAppContext } from '@/context/context-aplication'
import Store from '@/restapi/store'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { Alert, StatusBar, StyleSheet, ToastAndroid } from 'react-native'

export default function Perfil() {
    const { setUser, setIsLogin, user } = useAppContext();
    const router = useRouter();
    const cerrarEliminarUsuario = async () => {
        try {
            await Store.clearKey();
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
    function goRoot(ruta:string,info:imgEdit){
        router.push({
            pathname:`/${ruta}` as any,
            params:{...info}
        });
    }
    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.header}>
                <Image
                    source={require('@/assets/images/tk-welcome.png')}
                    style={styles.imagenPerfil}
                />
                <ThemedView >
                    <ThemedText type="title">{user?.apellido}</ThemedText>
                    <ThemedView style={styles.containerLogount}>
                        <ThemedView >
                            <ThemedText type="subtitle">{user?.nombres}</ThemedText>
                            <ThemedText type="default">{user?.nombreclub}</ThemedText>
                        </ThemedView>
                        <ThemedButton
                            icon="logout"
                            iconSet="material"
                            onPress={() => cerrarUsuario()}
                            title="Salir"
                            style={styles.button}
                        />
                    </ThemedView>
                </ThemedView>
            </ThemedView>
            <ScrollableView>
                <ThemedView >
                    <ThemedButton
                        icon="account-box"
                        iconSet="material"
                        onPress={() => goRoot('editusuario',{'id':0,'tipo':''})}
                        title="Modificar Datos"
                        style={styles.btnEditUser}
                    />
                    <ThemedButton
                        icon="camera-alt"
                        iconSet="material"
                        onPress={() => goRoot('changeimg',{'id':user?.id??0,'tipo':'U'})}
                        title="Cambiar Foto"
                        style={styles.btnEditUser}
                    />
                    <ThemedButton
                        icon="fmd-good"
                        iconSet="material"
                        onPress={() => goRoot('positionmap',{'id':user?.id??0,'tipo':'U'})}
                        title="Cambiar Ubicación"
                        style={styles.btnEditUser}
                    />
                    <MapaLeaflet />
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
        gap: 12,
        padding: 6,
        borderBottomWidth: 1,
        borderColor: '#ddd',
    },
    containerLogount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
    },
    imagenPerfil: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    button: {
        width: 85,
        height: 45,
        marginBottom: 10,
        backgroundColor: '#a81313ff',
    },
    btnEditUser:{
        width: '100%',
        height: 45,
        marginBottom: 10,
        backgroundColor: '#214950ff',
    },
    containerScroll:{
        padding: 10 ,
    }
})