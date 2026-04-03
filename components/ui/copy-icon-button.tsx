import { useEffect, useRef, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { copyToClipboard, type ClipboardCopyPayload } from '@/src/lib/clipboard';
import { colorTokens, radius, spacing } from '@/theme';

type CopyIconButtonProps = {
  payload: ClipboardCopyPayload | null;
  copyLabel?: string;
  copiedLabel?: string;
};

export function CopyIconButton({
  payload,
  copyLabel = 'Kopieer tekst',
  copiedLabel = 'Tekst gekopieerd',
}: CopyIconButtonProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const canCopy = Boolean(payload?.plainText && payload.plainText.trim().length > 0);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function handleCopy() {
    if (!canCopy || !payload) {
      return;
    }

    try {
      await copyToClipboard(payload);
      setCopied(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={copied ? copiedLabel : copyLabel}
      onPress={() => void handleCopy()}
      disabled={!canCopy}
      style={[
        styles.button,
        {
          backgroundColor: palette.surfaceLow,
          opacity: canCopy ? 1 : 0.5,
        },
      ]}>
      <MaterialIcons
        name={copied ? 'check' : 'content-copy'}
        size={18}
        color={copied ? palette.success : palette.mutedSoft}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxs,
  },
});
