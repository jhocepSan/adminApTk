import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'outlined' | 'underline';
};

export function ThemedTextInput({
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...rest
}: ThemedTextInputProps) {
    const textColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        'text'
    );

    const backgroundColor = useThemeColor(
        {light: '#d8d8d8ff', dark: '#525252ff'},
        'background'
    );

    const borderColor = useThemeColor(
        {},
        'border'
    );

    return (
        <TextInput
            placeholderTextColor={borderColor}
            style={[
                { color: textColor, backgroundColor },
                type === 'default' ? styles.default : undefined,
                type === 'outlined' ? styles.outlined : undefined,
                type === 'underline' ? styles.underline : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        padding: 12,
        borderRadius: 8,
    },
    outlined: {
        fontSize: 16,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    underline: {
        fontSize: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
});
