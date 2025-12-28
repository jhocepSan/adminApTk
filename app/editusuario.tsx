import { UserCard } from '@/components/card-usuario';
import ScrollableView from '@/components/contenedor-scroll-view';
import { ThemedButton } from '@/components/themed-buton-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { router } from 'expo-router';
import { StatusBar, StyleSheet } from 'react-native';
import { userCard } from '../constants/typesdata';

export default function EditUsuario() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.contaihead}>
        <ThemedText type="title" style={{textAlign:'center'}}>Modificar Datos</ThemedText>
        <ThemedView style={styles.contbtn}>
          <ThemedButton
            icon="close"
            iconSet="material"
            onPress={() => router.back()}
            title="SALIR"
            style={styles.btnfail}
          />
          <ThemedButton
            icon="done"
            iconSet="material"
            onPress={() => router.back()}
            title="GUARDAR"
            style={styles.btnok}
          />
        </ThemedView>
      </ThemedView>
      <ScrollableView>
        <UserCard info={{name:'Juan Jose Sanchez Choquecallata',age:20,grade:'10°',genero:'Masculino'} as userCard}/>
      </ScrollableView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 0,
    alignItems: 'center',
  },
  contaihead:{
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    width: '100%',
  },
  contbtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    //backgroundColor: '#585858a2',
    padding:3,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  btnfail: {
    width: '50%',
    height: 45,
    marginBottom: 10,
    backgroundColor: '#884134ff',
  },
  btnok: {
    width: '50%',
    height: 45,
    marginBottom: 10,
    backgroundColor: '#3e8834ff',
  }
});
