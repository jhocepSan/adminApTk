import { useAppContext } from "@/context/context-aplication";
import { Stack } from "expo-router";

export default function MainStack() {
    const { isLogin } = useAppContext(); // 👈 obtenemos el valor desde el contexto
    console.log(isLogin)
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(admins)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="editusuario" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="changeimg" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="positionmap" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
    );
}