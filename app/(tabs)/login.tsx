import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedButton } from '@/components/themed-buton-icon';
import { ThemedLoader } from '@/components/themed-loading';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppContext } from '@/context/context-aplication';
import Store from '@/restapi/store';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import ApiRest from '../../restapi/api';

export default function Login() {
    const { setLoading, loading, setIsLogin, setUser } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const comprobarLogin = async () => {
        try {
            if (email === '' || password === '') {
                ToastAndroid.showWithGravity("Campos Vacios, no PERMITIDO", ToastAndroid.SHORT, ToastAndroid.CENTER);
            } else {
                setLoading(true);
                let result = await ApiRest.loginUser({ correo: email, password: password });
                if (result.ok) {
                    console.log("guardas datos");
                    await Store.createKey(result.ok);
                    setUser(result.ok);
                    setIsLogin(true);
                } else {
                    ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
                }
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado';
            ToastAndroid.show(message, ToastAndroid.SHORT);
        } finally {
            setLoading(false);
        }
    }
    return (
        <ParallaxScrollView
            style={{padding: 26}}
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#3d4777ff' }}
            headerImage={
                <Image
                    source={require('@/assets/images/icon.png')}
                    style={styles.reactLogo}
                />
            }>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Iniciar Sesión</ThemedText>
            </ThemedView>
            <ThemedView style={styles.formContainer}>
                <ThemedText type="defaultSemiBold">
                    <IconSymbol size={20} name={"email.fill" as any} color={'#808080'} /> Correo
                </ThemedText>
                <ThemedTextInput
                    placeholder="Usuario"
                    type="outlined"
                    value={email}
                    onChangeText={(val) => setEmail(val.toLocaleLowerCase())}
                    style={styles.textInput}
                />
                <ThemedText type="defaultSemiBold">
                    <IconSymbol size={20}
                        name={"password.fill" as any}
                        color={'#808080'} /> Contraseña</ThemedText>
                <ThemedTextInput
                    placeholder="Contraseña"
                    secureTextEntry
                    type="outlined"
                    onChangeText={(val) => setPassword(val)}
                    style={styles.textInput}
                />
                <ThemedButton
                    icon="check-circle-outline"
                    iconSet="material"
                    onPress={() => comprobarLogin()}
                    title="ENTRAR"
                    style={styles.button}
                />
                <ThemedText type="link" onPress={() => console.log("hoajodj")}>
                    ¿Olvidaste tu contraseña?
                </ThemedText>
                <ThemedText type="link" onPress={() => console.log("loooooooo")}>
                    ¿No tienes una cuenta?
                </ThemedText>
            </ThemedView>
            <ThemedLoader
                visible={loading} fullscreen
            />
        </ParallaxScrollView>
    )
}

const styles = StyleSheet.create({
    textInput: {
        width: 300,
        height: 45,
        marginBottom: 10,
    },
    button: {
        width: 300,
        height: 45,
        marginBottom: 10,
        backgroundColor: '#5a8d46ff',
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        textAlign: 'center',
        alignItems: 'center',
    },
    formContainer: {
        alignItems: 'flex-start',
    },
    reactLogo: {
        height: 240,
        width: 240,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    textForm: {
        textAlign: 'left',
        alignItems: 'flex-start',
    },
});