import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

type AlertType = 'info' | 'success' | 'warning' | 'error' | 'empty';

interface AlertBlockProps {
  type?: AlertType;
  message: string;
  description?: string;
  style?: ViewStyle;
}

export function AlertBlock({ type = 'info', message, description, style }: AlertBlockProps) {
  // Configuración de colores e iconos según el tipo
  const config = {
    info: { color: '#214950', icon: 'information-outline' as const },
    success: { color: '#34C759', icon: 'check-circle-outline' as const },
    warning: { color: '#FF9500', icon: 'alert-outline' as const },
    error: { color: '#FF3B30', icon: 'close-circle-outline' as const },
    empty: { color: '#8E8E93', icon: 'database-off-outline' as const },
  };

  const { color, icon } = config[type];

  return (
    <View style={[styles.container, { borderColor: color + '40', backgroundColor: color + '10' }, style]}>
      <MaterialCommunityIcons name={icon} size={32} color={color} />
      <View style={styles.textContainer}>
        <ThemedText style={[styles.message, { color }]}>{message}</ThemedText>
        {description && (
          <ThemedText style={styles.description}>{description}</ThemedText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 10,
    marginHorizontal: 5,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 2,
  },
});
