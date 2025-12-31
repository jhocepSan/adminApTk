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

  // 🔐 BLOQUEO TOTAL SI YA ESTÁ LOGUEADO
  useEffect(() => {
    if (isLogin) {
      router.replace('/(admins)/register');
    }
  }, [isLogin]);

  // ⛔ evita render fantasma
  if (isLogin) return null;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
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
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: 'Login',
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
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
        }}
      />

    </Tabs>
  );
}
