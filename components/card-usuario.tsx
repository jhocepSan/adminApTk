import { useThemeColor } from '@/hooks/use-theme-color';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { userCard } from '../constants/typesdata';

type UserCardProps = {
    info?: userCard;
    onPress?: () => void;
    lightColor?: string;
    darkColor?: string;
};

const DEFAULT_AVATAR =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export function UserCard({
    info,
    onPress,
}: UserCardProps) {

    const backgroundColor = useThemeColor(
        { light: '#a8a8a86c', dark: '#9c9c9c33' },
        'background'
    );

    const textColor = useThemeColor(
        { light: '#111111', dark: '#ffffff' },
        'text' 
    );

    const borderColor = useThemeColor(
        { light: '#ddd', dark: '#333' },
        'border'
    );

    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.card,
                { backgroundColor, borderColor },
            ]}
        >
            <Image
                source={{ uri: info?.photoUri || DEFAULT_AVATAR }}
                style={styles.avatar}
            />

            <View style={styles.info}>
                <Text
                    style={[styles.name, { color: textColor }]}
                    numberOfLines={1}
                >
                    {info?.name}
                </Text>

                <Text style={[styles.meta, { color: textColor }]}>
                    Edad: {info?.age}
                </Text>

                <Text style={[styles.meta, { color: textColor }]}>
                    Grado: {info?.grade}
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 6,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
    },
    info: {
        width: '70%',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
    },
    meta: {
        fontSize: 14,
        opacity: 0.8,
        marginTop: 2,
    },
});
