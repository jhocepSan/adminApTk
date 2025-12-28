
import ScrollableView from '@/components/contenedor-scroll-view';
import { Text } from '@react-navigation/elements';
import { StyleSheet } from 'react-native';

export default function admin() {
    return (
        <ScrollableView>
            <Text>perfil</Text>
        </ScrollableView>
    )
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
});