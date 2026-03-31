import { useState } from 'react';
import { Pressable, StyleSheet, TextInput } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { sendMagicLink } from '@/services';
import { spacing } from '@/theme';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSendMagicLink() {
    setSubmitting(true);
    setStatus(null);

    try {
      await sendMagicLink(email);
      setStatus('Magic link verzonden. Check je mailbox om in te loggen.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Inloggen mislukt.';
      setStatus(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Inloggen</ThemedText>
      <ThemedText>
        Gebruik je e-mailadres om een magic link te ontvangen. Na openen van de link word je
        automatisch doorgestuurd naar de app.
      </ThemedText>

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={setEmail}
        placeholder="naam@voorbeeld.nl"
        style={styles.input}
        value={email}
      />

      <Pressable onPress={handleSendMagicLink} disabled={submitting} style={styles.button}>
        <ThemedText lightColor="#FFFFFF" darkColor="#FFFFFF" type="defaultSemiBold">
          {submitting ? 'Bezig...' : 'Stuur magic link'}
        </ThemedText>
      </Pressable>

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
    justifyContent: 'center',
  },
  input: {
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
