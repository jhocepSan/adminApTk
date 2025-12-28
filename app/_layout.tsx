import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AppProvider } from '@/context/context-aplication';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MainStack from './main-stack';


export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <MainStack />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}

