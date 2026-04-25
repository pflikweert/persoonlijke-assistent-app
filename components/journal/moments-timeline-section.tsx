import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, type LayoutChangeEvent, type ViewStyle } from 'react-native';

import { MomentPhotoViewerModal } from '@/components/journal/moment-photo-viewer-modal';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { fetchEntryPhotosByRawEntryIds, type EntryPhotoAssetGroup } from '@/services';
import { colorTokens, radius, spacing } from '@/theme';

export type TimelineMomentEntry = {
  id: string;
  raw_entry_id: string;
  title: string | null;
  summary_short: string | null;
  body: string;
  source_type: string | null;
  captured_at: string;
};

type MomentsTimelineSectionProps = {
  title?: string;
  entries: TimelineMomentEntry[];
  rightLabel?: string;
  focusedEntryId?: string | null;
  onEntryPress: (entry: TimelineMomentEntry) => void;
  previewText: (entry: TimelineMomentEntry) => string;
  onEntryLayout?: (entryId: string, y: number) => void;
  style?: ViewStyle;
};

export function MomentsTimelineSection({
  title,
  entries,
  rightLabel,
  focusedEntryId,
  onEntryPress,
  previewText,
  onEntryLayout,
  style,
}: MomentsTimelineSectionProps) {
  const scheme = useColorScheme() ?? 'light';
  const palette = colorTokens[scheme];
  const [entryPhotosByRawEntryId, setEntryPhotosByRawEntryId] = useState<EntryPhotoAssetGroup>({});
  const [viewerRawEntryId, setViewerRawEntryId] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const rawEntryIds = useMemo(
    () => [...new Set(entries.map((entry) => entry.raw_entry_id?.trim()).filter(Boolean))],
    [entries]
  );

  useEffect(() => {
    let cancelled = false;

    async function loadEntryPhotos() {
      if (rawEntryIds.length === 0) {
        if (!cancelled) {
          setEntryPhotosByRawEntryId({});
        }
        return;
      }

      try {
        const next = await fetchEntryPhotosByRawEntryIds(rawEntryIds);
        if (!cancelled) {
          setEntryPhotosByRawEntryId(next);
        }
      } catch {
        if (!cancelled) {
          setEntryPhotosByRawEntryId({});
        }
      }
    }

    void loadEntryPhotos();

    return () => {
      cancelled = true;
    };
  }, [rawEntryIds]);

  if (entries.length === 0) {
    return null;
  }

  const viewerEntry =
    viewerRawEntryId === null
      ? null
      : entries.find((entry) => entry.raw_entry_id === viewerRawEntryId) ?? null;
  const viewerPhotos =
    viewerRawEntryId === null ? [] : entryPhotosByRawEntryId[viewerRawEntryId] ?? [];

  return (
    <>
      <ThemedView style={[styles.section, style]}>
        {title || rightLabel ? (
          <ThemedView style={styles.headerRow}>
            {title ? (
              <ThemedText type="meta" style={[styles.title, { color: palette.primary }]}>
                {title}
              </ThemedText>
            ) : (
              <ThemedView />
            )}
            {rightLabel ? (
              <ThemedText type="caption" style={[styles.rightLabel, { color: palette.mutedSoft }]}>
                {rightLabel}
              </ThemedText>
            ) : null}
          </ThemedView>
        ) : null}

        <ThemedView style={styles.list}>
          {entries.map((entry, index) => {
            const entryPhotos = entryPhotosByRawEntryId[entry.raw_entry_id] ?? [];
            const primaryPhoto = entryPhotos[0] ?? null;

            return (
              <ThemedView
                key={entry.id}
                onLayout={
                  onEntryLayout
                    ? (event: LayoutChangeEvent) => onEntryLayout(entry.id, event.nativeEvent.layout.y)
                    : undefined
                }
                style={[
                  styles.row,
                  focusedEntryId === entry.id
                    ? {
                        backgroundColor: palette.surfaceLow,
                        borderWidth: StyleSheet.hairlineWidth,
                        borderColor: palette.primary,
                      }
                    : null,
                ]}>
                <ThemedView style={styles.timeCol}>
                  <ThemedView style={styles.timeMetaRow}>
                    <ThemedText type="caption" style={[styles.timeText, { color: palette.mutedSoft }]}>
                      {formatTime(entry.captured_at)}
                    </ThemedText>
                  </ThemedView>

                  {primaryPhoto ? (
                    <Pressable
                      accessibilityRole="imagebutton"
                      accessibilityLabel={
                        entryPhotos.length > 1
                          ? `Open ${entryPhotos.length} foto's voor ${entry.title?.trim() || 'dit moment'}`
                          : `Open foto voor ${entry.title?.trim() || 'dit moment'}`
                      }
                      onPress={() => {
                        setViewerRawEntryId(entry.raw_entry_id);
                        setViewerIndex(0);
                      }}
                      style={styles.thumbButton}>
                      <Image source={primaryPhoto.thumbSource} contentFit="cover" style={styles.thumbImage} />
                    </Pressable>
                  ) : null}
                </ThemedView>

                <ThemedView style={styles.trackCol}>
                  <MaterialIcons
                    name={entry.source_type === 'audio' ? 'mic' : 'edit-note'}
                    size={13}
                    color={palette.primary}
                  />
                  {index < entries.length - 1 || Boolean(primaryPhoto) ? (
                    <ThemedView style={[styles.line, { backgroundColor: `${palette.separator}88` }]} />
                  ) : null}
                </ThemedView>

                <Pressable accessibilityRole="button" onPress={() => onEntryPress(entry)} style={styles.contentCol}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ color: palette.text }}>
                    {entry.title?.trim() || 'Moment zonder titel'}
                  </ThemedText>
                  <ThemedText type="bodySecondary" numberOfLines={3} style={{ color: palette.muted }}>
                    {previewText(entry)}
                  </ThemedText>
                </Pressable>
              </ThemedView>
            );
          })}
        </ThemedView>
      </ThemedView>

      <MomentPhotoViewerModal
        photos={viewerPhotos}
        viewerIndex={viewerIndex}
        setViewerIndex={(value) => {
          setViewerIndex(value);
          if (value === null) {
            setViewerRawEntryId(null);
          }
        }}
        title={viewerEntry?.title}
      />
    </>
  );
}

function formatTime(isoValue: string): string {
  const date = new Date(isoValue);
  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }

  return date.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    letterSpacing: 0.35,
  },
  rightLabel: {
    letterSpacing: 0.2,
    fontWeight: '400',
  },
  list: {
    gap: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: spacing.sm,
    minHeight: 72,
    borderRadius: radius.md,
  },
  timeCol: {
    width: 48,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingTop: 1,
    gap: spacing.xxs,
  },
  timeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  timeText: {
    letterSpacing: 0.2,
  },
  thumbButton: {
    width: 44,
    height: 54,
    overflow: 'hidden',
    borderRadius: 7,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  trackCol: {
    width: 12,
    alignItems: 'center',
    paddingTop: 3,
  },
  line: {
    width: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: spacing.xs,
  },
  contentCol: {
    flex: 1,
    gap: spacing.xxs,
    paddingBottom: spacing.md,
  },
});
