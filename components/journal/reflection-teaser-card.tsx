import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { parseJsonStringArray } from '@/services';
import type { PeriodType } from '@/services/reflections';
import type { Json } from '@/src/lib/supabase/database.types';
import { colorTokens, radius, spacing, typography } from '@/theme';

export type ReflectionTeaserReflection = {
  generated_at: string;
  highlights_json: Json;
  period_end: string;
  period_start: string;
  reflection_points_json: Json;
  summary_text: string | null;
};

type ReflectionTeaserCardProps = {
  periodType: PeriodType;
  reflection: ReflectionTeaserReflection | null;
  onPress?: () => void;
  ctaLabel?: string;
  emptyLabel?: string;
  style?: ViewStyle;
};

export function ReflectionTeaserCard({
  periodType,
  reflection,
  onPress,
  ctaLabel = 'Lees volledig inzicht',
  emptyLabel,
  style,
}: ReflectionTeaserCardProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const title = periodType === 'week' ? 'WEEKELIJKSE REFLECTIE' : 'MAANDELIJKSE REFLECTIE';
  const preview = buildPreviewText(reflection);
  const meta = reflection ? formatMetaLabel(periodType, reflection.period_start) : null;
  const textLabel = emptyLabel ?? `Nog geen ${title.toLowerCase()} beschikbaar.`;

  const content = (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.headerRow}>
        <ThemedView style={styles.titleRow}>
          <MaterialIcons name="auto-awesome" size={18} color={palette.primary} />
          <ThemedText type="meta" style={[styles.title, { color: palette.primary }]}>
            {title}
          </ThemedText>
        </ThemedView>
        {meta ? (
          <ThemedView style={styles.metaWrap}>
            <ThemedText type="caption" style={[styles.metaText, { color: palette.mutedSoft }]}>
              {meta.dateLine}
            </ThemedText>
          </ThemedView>
        ) : null}
      </ThemedView>

      <ThemedText type="bodySecondary" numberOfLines={3} style={[styles.preview, { color: palette.muted }]}>
        {reflection ? preview : textLabel}
      </ThemedText>

      {onPress ? (
        <ThemedText type="caption" style={[styles.cta, { color: palette.primary }]}>
          {ctaLabel}
        </ThemedText>
      ) : null}
    </ThemedView>
  );

  if (!onPress) {
    return <ThemedView style={[styles.wrap, style]}>{content}</ThemedView>;
  }

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wrap, style, pressed ? styles.pressed : null]}>
      {content}
    </Pressable>
  );
}

function buildPreviewText(reflection: ReflectionTeaserReflection | null): string {
  if (!reflection) {
    return '';
  }

  const summary = reflection.summary_text?.trim() ?? '';
  const highlights = parseJsonStringArray(reflection.highlights_json);
  const points = parseJsonStringArray(reflection.reflection_points_json);
  const firstPoint = points[0]?.trim() ?? '';
  if (firstPoint.length > 0) {
    return firstPoint;
  }

  const firstHighlight = highlights[0]?.trim() ?? '';
  if (firstHighlight.length > 0) {
    return firstHighlight;
  }

  if (summary.length > 0) {
    return summary;
  }

  return 'Nog geen inhoud beschikbaar.';
}

function formatMetaLabel(periodType: PeriodType, periodStart: string): { dateLine: string } | null {
  const date = new Date(`${periodStart}T12:00:00.000Z`);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  if (periodType === 'week') {
    const weekNumber = getIsoWeekNumber(date);
    const shortYear = String(date.getUTCFullYear()).slice(-2);
    return {
      dateLine: `W${weekNumber} ${shortYear}`,
    };
  }

  const month = date.toLocaleDateString('nl-NL', {
    month: 'short',
    timeZone: 'UTC',
  });
  const shortYear = String(date.getUTCFullYear()).slice(-2);

  return {
    dateLine: `${month} ${shortYear}`,
  };
}

function getIsoWeekNumber(date: Date): number {
  const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  return Math.ceil(((utcDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
  },
  pressed: {
    opacity: 0.96,
  },
  card: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  title: {
    fontSize: typography.roles.meta.size,
    lineHeight: typography.roles.meta.lineHeight,
    fontWeight: typography.roles.meta.weight,
    letterSpacing: typography.roles.meta.letterSpacing,
    textTransform: 'uppercase',
  },
  metaWrap: {
    alignItems: 'flex-end',
  },
  metaText: {
    fontFamily: typography.families.sans,
    fontSize: typography.roles.caption.size,
    lineHeight: typography.roles.caption.lineHeight,
    fontWeight: typography.roles.caption.weight,
    letterSpacing: typography.roles.caption.letterSpacing,
    textTransform: 'none',
  },
  preview: {
    lineHeight: 26,
    fontStyle: 'italic',
  },
  cta: {
    letterSpacing: 0.1,
  },
});
