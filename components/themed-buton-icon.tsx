import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';

type IconSet = 'ion' | 'material';
type ThemedButtonProps = {
    title: string;
    icon?: keyof typeof Ionicons.glyphMap | keyof typeof MaterialIcons.glyphMap;
    iconSet?: IconSet;
    onPress?: () => void;
    lightColor?: string;
    darkColor?: string;
    style?: ViewStyle;
};


function RenderIcon({
    icon,
    iconSet,
    color,
}: {
    icon: any;
    iconSet: IconSet;
    color: string;
}) {
    if (iconSet === 'material') {
        return <MaterialIcons name={icon} size={20} color={color} />;
    }

    return <Ionicons name={icon} size={20} color={color} />;
}


export function ThemedButton({
    title,
    icon,
    iconSet,
    onPress,
    lightColor,
    darkColor,
    style,
}: ThemedButtonProps) {
    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        'text'
    );

    const backgroundColor = useThemeColor({}, 'background');

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.button,
                { backgroundColor, opacity: pressed ? 0.7 : 1 },
                style,
            ]}
        >
            {icon && (
                <RenderIcon
                    icon={icon}
                    iconSet={iconSet ?? 'ion'}
                    color={textColor}
                />
            )}
            <Text style={[styles.text, { color: textColor }]}>
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row', // ← clave
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        justifyContent: 'center',
    },
});
