import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/ui/screen-primitives';

export default function ModalScreen() {
  return (
    <ScreenContainer backgroundTone="flat" style={styles.container}>
      <ThemedText type="title">Informatie</ThemedText>
      <Link href="/" dismissTo style={styles.link}>
        <ThemedText type="link">Terug naar start</ThemedText>
      </Link>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
