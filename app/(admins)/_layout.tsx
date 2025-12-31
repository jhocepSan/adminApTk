import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAppContext } from '@/context/context-aplication';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const { loading, isLogin } = useAppContext();
  const colorScheme = useColorScheme();
  const router = useRouter();
  useEffect(() => {
    if (!isLogin) {
      router.replace('/(tabs)');
    }
  }, [isLogin]);
  if (!isLogin) return null;
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarButton: (props) => (
            <HapticTab
              {...props}
              disabled={loading}
              style={[
                props.style, // importante: preserva estilos originales
                { opacity: loading ? 0.4 : 1 },
              ]}
            />
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={"person.fill" as any} color={color} />,
        }}
      />
      <Tabs.Screen
        name="docentes"
        options={{
          title: 'Docentes',
          tabBarButton: (props) => (
            <HapticTab
              {...props}
              disabled={loading}
              style={[
                props.style, // importante: preserva estilos originales
                { opacity: loading ? 0.4 : 1 },
              ]}
            />
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={"docentes.fill" as any} color={color} />,
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          title: 'Estudiantes',
          tabBarButton: (props) => (
            <HapticTab
              {...props}
              disabled={loading}
              style={[
                props.style, // importante: preserva estilos originales
                { opacity: loading ? 0.4 : 1 },
              ]}
            />
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={"registro.fill" as any} color={color} />,
        }}
      />
      <Tabs.Screen
        name="horarios"
        options={{
          title: 'Horarios',
          tabBarButton: (props) => (
            <HapticTab
              {...props}
              disabled={loading}
              style={[
                props.style, // importante: preserva estilos originales
                { opacity: loading ? 0.4 : 1 },
              ]}
            />
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={"horarios.fill" as any} color={color} />,
        }}
      />
      <Tabs.Screen
        name="campeonato"
        options={{
          title: 'Campeonato',
          tabBarButton: (props) => (
            <HapticTab
              {...props}
              disabled={loading}
              style={[
                props.style, // importante: preserva estilos originales
                { opacity: loading ? 0.4 : 1 },
              ]}
            />
          ),
          tabBarIcon: ({ color }) => <IconSymbol size={28} name={"campeonato.fill" as any} color={color} />,
        }}
      />
    </Tabs>
  );
}
