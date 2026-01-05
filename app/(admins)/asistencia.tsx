import { AlertBlock } from '@/components/alert-bloque';
import { EstCardAsis } from '@/components/card-estu-asis';
import ScrollableView from '@/components/contenedor-scroll-view';
import { CustomHeader } from '@/components/head-asistencia';
import HeaderDias from '@/components/head-dias';
import { FilaHorario } from '@/components/horario-class';
import { ThemedLoader } from '@/components/themed-loading';
import { estuAsisType, horarioType } from '@/constants/typesdata';
import { useAppContext } from '@/context/context-aplication';
import ApiRes from '@/restapi/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type DiaSemana = 'D' | 'L' | 'M' | 'MI' | 'J' | 'V' | 'S';
const dianombre: DiaSemana[] = ['D', 'L', 'M', 'MI', 'J', 'V', 'S']
const diasMapa: Record<DiaSemana, number> = { 'D': 0, 'L': 1, 'M': 2, 'MI': 3, 'J': 4, 'V': 5, 'S': 6 };
const diaCompleto : Record<string, string> = { 'L': 'LUNES', 'M': 'MARTES', 'MI':'MIERCOLES','J':'JUEVES','V':'VIERNES','S':'SABADO','D':'DOMINGO' };

export default function Asistencia() {
  const { loading, setLoading, user } = useAppContext();
  const [dia, setDia] = useState<DiaSemana>('L');
  const [horarios, setHorarios] = useState<horarioType[]>([]);
  const [alumnos, setAlumnos] = useState<estuAsisType[]>([]);
  const [isInit, setIsInit] = useState<boolean>(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [fechaS, setFechaS] = useState('');
  const [fechaHistorial, setFechaHistorial] = useState(new Date());
  const [fechaLimite, setFechaLimite] = useState(new Date());
  const [selectHorario,setSelectHorario] = useState<horarioType|null>(null)
  
  const getHorarios = async (dias: DiaSemana) => {
    try {
      setLoading(true);
      const result = await ApiRes.getHorarios({ idclub: user?.idclub, dia: dias });
      if (result.ok) {
        setHorarios(result.ok);
      } else {
        ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado';
      ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
    } finally {
      setLoading(false);
    }
  }

  const obtenerAlimnos = async (dato: horarioType,fechasel:any) => {
    try {
      setLoading(true);
      const result = await ApiRes.getAsisEstudi({ idclub: user?.idclub, idperiodo: dato.idperiodo, fecha: fechasel })
      if (result.ok) {
        console.log(result.ok)
        if (result.ok.length !== 0) {
          setAlumnos(result.ok);
          setIsInit(true);
        } else {
          setIsInit(false);
          setAlumnos([]);
          ToastAndroid.showWithGravity("No hay estudiantes registrados en este horario", ToastAndroid.LONG, ToastAndroid.CENTER);
        }
      } else {
        ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado';
      ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
    } finally {
      setLoading(false);
    }
  }
  const changeAsistencia = async (info: any) => {
    try {
      setLoading(true);
      const alumnosPrevios = [...alumnos]; // Copia de seguridad
      const nuevosAlumnos = alumnos.map(estu => {
        if (estu.idasistencia === info.id) {
          // Retornamos el mismo objeto pero con el 'presente' actualizado
          // También actualizamos 'estado_presente' para que el texto cambie
          const labels: Record<number, string> = { 1: 'Asistió', 2: 'Faltó', 3: 'Enfermo', 4: 'Permiso' };
          return {
            ...estu,
            presente: info.estado,
            estado_presente: labels[info.estado] || '--'
          };
        }
        return estu;
      });
      const result = await ApiRes.changeAsistencia({ presente: info.estado, idasistencia: info.id });
      if (result.ok) {
        setAlumnos(nuevosAlumnos);
        ToastAndroid.showWithGravity(result.ok, ToastAndroid.LONG, ToastAndroid.CENTER);
      } else {
        setAlumnos(alumnosPrevios);
        ToastAndroid.showWithGravity(result.error, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error inesperado';
      ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.CENTER);
    } finally {
      setLoading(false);
    }
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowCalendar(false);
    if (selectedDate) {
      const diaRef = diasMapa[dia]
      console.log(diaRef,selectedDate.getDay())
      if (selectedDate.getDay() !== diaRef) {
        // AVISAR AL USUARIO
        ToastAndroid.showWithGravity(`Elija fechas antiguas, del dia '${diaCompleto[dia]}'`, ToastAndroid.LONG, ToastAndroid.CENTER);
      }
      let fecha = selectedDate.toISOString().split('T')[0]
      obtenerAlimnos(selectHorario as horarioType,fecha)
    }
  };
  function obtenerFechaReal(val: DiaSemana) {
    let nuevaFecha = new Date(fechaHistorial);
    let dia_actual = fechaHistorial.getDay()
    let dia_selccionada = diasMapa[val as DiaSemana]
    let diferencia = dia_selccionada - dia_actual;
    if (diferencia > 0) {
      diferencia -= 7;
    }
    nuevaFecha.setDate(nuevaFecha.getDate() + diferencia);
    console.log(nuevaFecha.toISOString().split('T')[0])
    setFechaLimite(nuevaFecha)
    setDia(val);
    getHorarios(val);
    setFechaS(nuevaFecha.toISOString().split('T')[0])
  }
  useFocusEffect(
    useCallback(() => {
      const startWatching = async () => {
        let fecha = new Date();
        setFechaS(fecha.toISOString().split('T')[0])
        setDia(dianombre[fecha.getDay()] as DiaSemana)
        getHorarios(dianombre[fecha.getDay()] as DiaSemana)
      };

      startWatching();

      // LIMPIEZA AUTOMÁTICA: Se ejecuta al salir de la pestaña
      return () => {

      };
    }, []
    ));
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1 }}>
      {!isInit ? <HeaderDias onPress={(val) => obtenerFechaReal(val)} seleccionado={dia} /> : (
        <CustomHeader title="Asistencia"
          showSearch={false}
          showCAlendar={true}
          onEventBtn={() => {
            
            ToastAndroid.showWithGravity(`Elija fechas antiguas, del dia '${diaCompleto[dia]}'`, ToastAndroid.LONG, ToastAndroid.CENTER);
            setShowCalendar(true);
          }}
          onBackPress={() => setIsInit(false)} />
      )}
      {!isInit ? (
        <ScrollableView>
          {horarios.length !== 0 ? (
            horarios.map((item, index) => (
              <FilaHorario
                key={index}
                info={item}
                hora={item.hora_ini}
                actividad={item.descripcion}
                estaOcupado={item.activo === 1 ? false : true}
                onPress={() => {
                  setSelectHorario(item);
                  obtenerAlimnos(item,fechaS);
                }}
              />
            ))) : (
            <AlertBlock type="info"
              message="No tienen clases"
              description="No se encontraron clases para este dia ..."
              style={{ marginTop: 2 }} />
          )
          }
        </ScrollableView>) : (
        <ScrollableView>
          {alumnos.map((item, index) => {
            return (
              <EstCardAsis info={item} key={index}
                onPress={() => {
                  if (item.presente !== 1) {
                    changeAsistencia({ id: item.idasistencia, estado: item.presente === 1 ? 2 : 1 })
                  }
                }}
                onPermiso={(dato) => changeAsistencia(dato)}
                onInactivate={(dato) => changeAsistencia(dato)}

              />
            )
          })}
          {showCalendar && (
            <DateTimePicker
              value={fechaLimite}
              mode="date"
              display="default"
              maximumDate={fechaLimite} // Bloquea días futuros
              onChange={onDateChange}
              onPointerEnter={onDateChange}
            />
          )}
        </ScrollableView>
      )}

      <ThemedLoader
        visible={loading} fullscreen
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})