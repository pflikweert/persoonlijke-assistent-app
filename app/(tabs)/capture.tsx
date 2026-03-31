import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { submitTextEntry } from '@/services';
import { spacing } from '@/theme';

export default function CaptureScreen() {
  const [rawText, setRawText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    setStatus(null);

    try {
      await submitTextEntry({
        rawText,
        capturedAt: new Date().toISOString(),
      });

      setRawText('');
      setStatus('Notitie verwerkt. Terug naar Vandaag...');
      router.replace('/');
    } catch (nextError) {
      const message =
        nextError instanceof Error ? nextError.message : 'Verwerken van notitie mislukt.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Vastleggen</ThemedText>
      <ThemedText>Typ een korte notitie. Deze wordt server-side verwerkt.</ThemedText>

      <TextInput
        multiline
        onChangeText={setRawText}
        placeholder="Wat wil je vastleggen?"
        style={styles.input}
        textAlignVertical="top"
        value={rawText}
      />

      <Pressable disabled={submitting} onPress={handleSubmit} style={styles.button}>
        <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
          {submitting ? 'Verwerken...' : 'Verwerk notitie'}
        </ThemedText>
      </Pressable>

      {error ? <ThemedText>{error}</ThemedText> : null}
      {status ? <ThemedText>{status}</ThemedText> : null}
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
  input: {
    minHeight: 180,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888888',
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0A7EA4',
    borderRadius: 8,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
});
