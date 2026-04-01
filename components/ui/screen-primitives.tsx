import { StyleSheet, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { spacing, typography } from '@/theme';

type Tone = 'neutral' | 'loading' | 'empty' | 'error' | 'success';

function toneLabel(tone: Tone): string {
  if (tone === 'loading') {
    return 'Bezig';
  }
  if (tone === 'empty') {
    return 'Nog niets';
  }
  if (tone === 'error') {
    return 'Er ging iets mis';
  }
  if (tone === 'success') {
    return 'Gelukt';
  }

  return 'Info';
}

export function ContentSection({
  title,
  children,
  style,
}: {
  title?: string;
  children: ReactNode;
  style?: ViewStyle;
}) {
  return (
    <ThemedView lightColor="#F5F7FA" darkColor="#1D2125" style={[styles.card, style]}>
      {title ? <ThemedText type="defaultSemiBold">{title}</ThemedText> : null}
      <ThemedView style={styles.cardBody}>{children}</ThemedView>
    </ThemedView>
  );
}

export function StateNotice({
  tone = 'neutral',
  message,
  detail,
  meta,
}: {
  tone?: Tone;
  message: string;
  detail?: string | null;
  meta?: string | null;
}) {
  return (
    <ThemedView lightColor="#F5F7FA" darkColor="#1D2125" style={styles.notice}>
      <ThemedText type="defaultSemiBold">{toneLabel(tone)}</ThemedText>
      <ThemedText>{message}</ThemedText>
      {detail ? <ThemedText style={styles.noticeDetail}>{detail}</ThemedText> : null}
      {meta ? <ThemedText style={styles.noticeMeta}>{meta}</ThemedText> : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888888',
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  cardBody: {
    gap: spacing.sm,
  },
  notice: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888888',
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.xs,
  },
  noticeDetail: {
    opacity: 0.85,
  },
  noticeMeta: {
    fontSize: typography.size.caption,
    opacity: 0.65,
  },
});
