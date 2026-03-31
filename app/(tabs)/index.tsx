import { StyleSheet } from 'react-native';

import { APP_CONFIG } from '@/constants';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { spacing } from '@/theme';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{APP_CONFIG.name}</ThemedText>
      </ThemedView>
      <ThemedText>
        Lokale bootstrap staat klaar. Gebruik deze basis om schermen en businesslogica gecontroleerd toe
        te voegen.
      </ThemedText>
      <ThemedText type="defaultSemiBold">Environment: {APP_CONFIG.environment}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  titleContainer: {
    gap: spacing.xs,
  },
});
