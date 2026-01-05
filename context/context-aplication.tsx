import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import Store from '../restapi/store';
export type Usuario = {
    id?: number;
    nombres: string;
    apellidos: string;
    nombreclub: string;
    correo: string;
    latitud: number;
    longitud: number;
    cedula: number;
    celular: number;
    idclub: number;
    foto:string;
    idadjunto:number;
    idubicacion:number;
    direccion:string;
};
// Definimos el tipo de estado global
type AppContextType = {
    user: Usuario | null;
    setUser: (user: Usuario | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
    infoHelp:any;
    setInfoHelp:( info:any)=>void;
};

// Creamos valores por defecto
const defaultContext: AppContextType = {
    user: null,
    setUser: () => { },
    loading: false,
    setLoading: () => { },
    isLogin: false,
    setIsLogin: () => { },
    infoHelp: null,
    setInfoHelp:()=>{},
};

// Creamos el contexto
const AppContext = createContext<AppContextType>(defaultContext);

// Creamos un provider para envolver la app
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(defaultContext.user);
    const [loading, setLoading] = useState(defaultContext.loading);
    const [isLogin, setIsLogin] = useState(defaultContext.isLogin);
    const [infoHelp,setInfoHelp] = useState(null);
    useEffect(() => {
        const cargarCredenciales = async () => {
            try {
                let result = await Store.cargarKey()
                if (result) {
                    console.log(JSON.parse(result));
                    setUser(JSON.parse(result));
                    setIsLogin(true);
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : 'Error inesperado';
                ToastAndroid.show(message, ToastAndroid.SHORT);
            }
        }
        cargarCredenciales();
    }, [])
    return (
        <AppContext.Provider value={{ user, setUser, loading, setLoading,
            isLogin, setIsLogin,infoHelp,setInfoHelp }}>
            {children}
        </AppContext.Provider>
    );
};

// Hook para usar el contexto más fácilmente
export const useAppContext = () => useContext(AppContext);
