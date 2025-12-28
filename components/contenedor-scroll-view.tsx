import type { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = PropsWithChildren;

export default function ScrollableView({ children }: Props) {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <Animated.ScrollView
      style={{ backgroundColor, flex: 1 }}
      contentContainerStyle={styles.content}
      scrollEventThrottle={16}
    >
      <ThemedView>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 10,
    gap: 16,
    flexGrow: 1,
  },
});
