import Buscador from '@/components/buscador';
import { UserCard } from '@/components/card-usuario';
import ScrollableView from '@/components/contenedor-scroll-view';
import HeaderEstudiantes from '@/components/head-estudiantes';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
    const [filtro, setFiltro] = useState<'F' | 'H' | 'A'>('A');
    const [buscar,setBuscar] = useState('');
    const eventoCabecera = (valor: 'F' | 'H' | 'A') => {
        console.log(valor);
        setFiltro(valor)
    }
    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
            <HeaderEstudiantes onPress={eventoCabecera} seleccionado={filtro} />
            <Buscador
                value={buscar}
                onChangeText={(val) => setBuscar(val)}
                onClear={() => setBuscar('')}
                placeholder="Buscar estudiante..."
                showAddButton={true}
                onAddPress={()=>{console.log("agregar usuario")}}
            />
            <ScrollableView>
                <UserCard />
                <UserCard />
                <UserCard />
            </ScrollableView>
        </SafeAreaView>
    )
}
