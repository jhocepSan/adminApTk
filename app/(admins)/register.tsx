import { AlertBlock } from '@/components/alert-bloque';
import Buscador from '@/components/buscador';
import { UserCard } from '@/components/card-usuario';
import ScrollableView from '@/components/contenedor-scroll-view';
import { FormularioEstudiante } from '@/components/form-estudiante';
import HeaderEstudiantes from '@/components/head-estudiantes';
import { BaseModal } from '@/components/modal-comp';
import { ThemedLoader } from '@/components/themed-loading';
import { estudianteType } from '@/constants/typesdata';
import { useAppContext } from '@/context/context-aplication';
import api from '@/restapi/api';
import React, { useEffect, useMemo, useState } from 'react';
import { ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Register() {
    const { loading, setLoading, user,infoHelp } = useAppContext();
    const [filtro, setFiltro] = useState<'F' | 'M' | 'A'>('F');
    const [buscar, setBuscar] = useState('');
    const [estudiantes, setEstudiantes] = useState<estudianteType[]>([]);
    const [cinturones,setCinturones] = useState([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editarEstu,setEditarEstu] = useState(false);
    const [selectEstu,setSelectEstu] = useState<estudianteType | null>(null);
    const eventoCabecera = (valor: 'F' | 'M' | 'A') => {
        setFiltro(valor)
    }
    const getEstudiantes = async () => {
        try {
            setLoading(true);
            const result = await api.getEstudiantes({ idclub: user?.idclub, idperiodo: 0, genero: filtro });
            if (result.ok) {
                setEstudiantes(result.ok);
            } else {
                ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
            }
            const infoCinturon = await api.getCinturones({idclub:user?.idclub});
            if (infoCinturon.ok) {
                setCinturones(infoCinturon.ok);
            } else {
                setCinturones([]);
                console.log(infoCinturon.error);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado';
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        } finally {
            setLoading(false);
        }
    }
    const guardarEstudiante = async(info:any)=>{
        try {
            setLoading(true);
            const result = await api.agregarEstudiante({...info,...infoHelp})
            if(result.ok){
                setSelectEstu(null);
                setShowModal(false);
                getEstudiantes();
            }else{
                ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado';
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        } finally {
            setLoading(false);
        }
    }
    const editarEstadoEstu = async(info:any)=>{
        try {
            setLoading(true);
            const result = await api.editarEstadoEstu(info);
            if(result.ok){
                console.log(result.ok);
                getEstudiantes();
            }else{
                ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error inesperado';
            ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
        } finally {
            setLoading(false);
        }
    }
    const editarEStudiante=(info:estudianteType)=>{
        console.log(info)
        setSelectEstu(info);
        setEditarEstu(true);
        setShowModal(true);
    }
    const estudiantesFiltrados = useMemo(() => {
        const term = buscar.toLowerCase();
        return estudiantes.filter(estu => 
            estu.nombres.toLowerCase().includes(term) || 
            estu.apellidos.toLowerCase().includes(term) ||
            estu.ci.toString().includes(term)
        );
    }, [buscar, estudiantes]);
    useEffect(() => {
        getEstudiantes()
    }, [filtro])
    return (
        <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
            <HeaderEstudiantes onPress={eventoCabecera} seleccionado={filtro} />
            <Buscador
                value={buscar}
                onChangeText={(val) => setBuscar(val)}
                onClear={() => setBuscar('')}
                placeholder="Buscar estudiante..."
                showAddButton={true}
                onAddPress={() => {
                    setEditarEstu(true);
                    setSelectEstu(null);
                    setShowModal(true);
                }}
                onLoadPress={()=>{
                    getEstudiantes();
                }}
            />
            <ScrollableView>
                {estudiantes.length !== 0 ? (
                    estudiantesFiltrados.map((item, index) => {
                        return (
                            <UserCard info={item} key={index} 
                                onPress={()=>{setEditarEstu(false);setSelectEstu(item);setShowModal(true);}}
                                onEdit={(dato)=>editarEStudiante(dato)}
                                onDelete={(dato)=>editarEstadoEstu(dato)}
                                onInactivate={(dato)=>editarEstadoEstu(dato)}/>
                        )
                    })
                ) : (
                    <AlertBlock type="empty"
                        message="Sin Estudiantes"
                        description="No se encontraron estudiantes asignados a este club actualmente."
                        style={{ marginTop: 2 }} />
                )}
            </ScrollableView>
            <BaseModal visible={showModal} onClose={() => setShowModal(false)} onSave={() => { }}
                title={`Estudiante`} showFooter={false}>
                <FormularioEstudiante
                    editar={editarEstu}
                    initialData={selectEstu}
                    cinturones={cinturones}
                    onSave={(data) => guardarEstudiante(data)} />
            </BaseModal>
            <ThemedLoader
                visible={loading} fullscreen
            />
        </SafeAreaView>
    )
}
