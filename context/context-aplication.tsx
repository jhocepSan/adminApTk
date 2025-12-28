import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import Store from '../restapi/store';
export type Usuario = {
    id: string;
    nombres: string;
    apellido: string;
    nombreclub: string;
    email: string;
    latitud: number;
    longitud: number;
};
// Definimos el tipo de estado global
type AppContextType = {
    user: Usuario | null;
    setUser: (user: Usuario | null) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
    isLogin: boolean;
    setIsLogin: (isLogin: boolean) => void;
};

// Creamos valores por defecto
const defaultContext: AppContextType = {
    user: null,
    setUser: () => { },
    loading: false,
    setLoading: () => { },
    isLogin: false,
    setIsLogin: () => { },
};

// Creamos el contexto
const AppContext = createContext<AppContextType>(defaultContext);

// Creamos un provider para envolver la app
export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState(defaultContext.user);
    const [loading, setLoading] = useState(defaultContext.loading);
    const [isLogin, setIsLogin] = useState(defaultContext.isLogin);
    useEffect(() => {
        const cargarCredenciales = async () => {
            try {
                var result = await Store.cargarKey()
                if (result) {
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
        <AppContext.Provider value={{ user, setUser, loading, setLoading, isLogin, setIsLogin }}>
            {children}
        </AppContext.Provider>
    );
};

// Hook para usar el contexto más fácilmente
export const useAppContext = () => useContext(AppContext);
