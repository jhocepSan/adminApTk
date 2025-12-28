import { useThemeColor } from '@/hooks/use-theme-color';
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from 'react-native';

type ThemedLoaderProps = {
    size?: 'small' | 'large';
    fullscreen?: boolean;
    visible?: boolean;
    style?: ViewStyle;
    lightColor?: string;
    darkColor?: string;
};

export function ThemedLoader({
    size = 'large',
    fullscreen = false,
    visible = false,
    style,
    lightColor,
    darkColor,
}: ThemedLoaderProps) {
    const color = useThemeColor({}, 'primary');
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'backgroundloading');
    const textcolor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
    if (!visible) return null;
    return (
        <View
            style={[
                styles.container,
                fullscreen && { backgroundColor },
                style
            ]}
        >
            <ActivityIndicator size={size} color={color} />
            <Text 
                style={[
                    { color:textcolor ,}
                ]}> Espere por favor ...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
});
