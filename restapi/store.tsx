import { Usuario } from '@/context/context-aplication';
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'ATDKCBBA';
async function createKey (info : Usuario) {
    console.log(info,"createkey");
    await SecureStore.setItemAsync(USER_KEY,JSON.stringify(info));
    return true
}

async function cargarKey() {
    var result = await SecureStore.getItemAsync(USER_KEY);
    return result
}
async function clearKey(){
    await SecureStore.deleteItemAsync(USER_KEY);
}
export default {createKey,cargarKey,clearKey}