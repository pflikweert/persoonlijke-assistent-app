import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  ConfirmSheet,
  type ConfirmSheetAction,
} from "@/components/feedback/destructive-confirm-sheet";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DetailSectionHeader } from "@/components/ui/detail-screen-primitives";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import { ModalBackdrop } from "@/components/ui/modal-backdrop";
import { PrimaryButton, StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  deleteEntryPhotoById,
  fetchEntryPhotosByRawEntryId,
  type EntryPhotoAsset,
  uploadEntryPhotoForEntry,
} from "@/services";
import { colorTokens, radius, spacing } from "@/theme";

type PreparedImageAsset = {
  displayBytes: ArrayBuffer;
  thumbBytes: ArrayBuffer;
  displayWidth: number;
  displayHeight: number;
  thumbWidth: number;
  thumbHeight: number;
  displaySizeBytes: number;
  thumbSizeBytes: number;
};

type BaseProps = {
  rawEntryId: string;
  refreshToken?: number;
  onPhotosChanged?: () => void;
};

const MAX_PHOTOS = 5;

function getLongEdgeResize(width: number, height: number, maxLongEdge: number) {
  if (width <= 0 || height <= 0) {
    return { width: maxLongEdge, height: maxLongEdge };
  }

  const longEdge = Math.max(width, height);
  if (longEdge <= maxLongEdge) {
    return { width: Math.round(width), height: Math.round(height) };
  }

  const ratio = maxLongEdge / longEdge;
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

async function buildPreparedImageAsset(
  uri: string,
  width: number,
  height: number
): Promise<PreparedImageAsset> {
  const displayResize = getLongEdgeResize(width, height, 1600);
  const thumbResize = getLongEdgeResize(width, height, 560);

  const display = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: displayResize }],
    {
      compress: 0.8,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  const thumb = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: thumbResize }],
    {
      compress: 0.75,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );

  const [displayBytes, thumbBytes] = await Promise.all([
    fetch(display.uri).then((response) => response.arrayBuffer()),
    fetch(thumb.uri).then((response) => response.arrayBuffer()),
  ]);

  return {
    displayBytes,
    thumbBytes,
    displayWidth: display.width,
    displayHeight: display.height,
    thumbWidth: thumb.width,
    thumbHeight: thumb.height,
    displaySizeBytes: displayBytes.byteLength,
    thumbSizeBytes: thumbBytes.byteLength,
  };
}

function useEntryPhotos(rawEntryId: string, refreshToken: number) {
  const [photos, setPhotos] = useState<EntryPhotoAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPhotos = useCallback(async () => {
    const id = rawEntryId.trim();
    if (!id) {
      setPhotos([]);
      return;
    }

    setLoading(true);
    try {
      const next = await fetchEntryPhotosByRawEntryId(id);
      setPhotos(next);
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Foto's laden mislukte.");
    } finally {
      setLoading(false);
    }
  }, [rawEntryId]);

  useEffect(() => {
    void loadPhotos();
  }, [loadPhotos, refreshToken]);

  return {
    photos,
    setPhotos,
    loading,
    error,
    setError,
    loadPhotos,
  };
}

function EntryPhotoViewer({
  photos,
  viewerIndex,
  setViewerIndex,
  onRequestDelete,
}: {
  photos: EntryPhotoAsset[];
  viewerIndex: number | null;
  setViewerIndex: (value: number | null) => void;
  onRequestDelete: (photo: EntryPhotoAsset) => void;
}) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const viewerScrollRef = useRef<ScrollView | null>(null);

  const viewerPageWidth = Math.max(1, viewportWidth);
  const viewerTopPadding = insets.top + spacing.sm;
  const viewerBottomPadding = Math.max(insets.bottom, spacing.md);
  const viewerTopControlsHeight = viewerTopPadding + 44;
  const viewerBottomControlsHeight = viewerBottomPadding + 28;
  const viewerFrameHeight = Math.max(
    280,
    viewportHeight - viewerTopControlsHeight - viewerBottomControlsHeight - spacing.lg * 2
  );
  const activePhoto = viewerIndex === null ? null : photos[viewerIndex] ?? null;

  useEffect(() => {
    if (viewerIndex === null) {
      return;
    }
    const handle = setTimeout(() => {
      viewerScrollRef.current?.scrollTo({
        x: viewerIndex * viewerPageWidth,
        animated: false,
      });
    }, 0);
    return () => clearTimeout(handle);
  }, [viewerIndex, viewerPageWidth]);

  function handleViewerScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / viewerPageWidth);
    const normalized = Math.max(0, Math.min(photos.length - 1, nextIndex));
    if (normalized !== viewerIndex) {
      setViewerIndex(normalized);
    }
  }

  return (
    <Modal
      transparent
      visible={viewerIndex !== null && Boolean(activePhoto)}
      animationType="fade"
      onRequestClose={() => setViewerIndex(null)}
    >
      <ModalBackdrop
        layout="bottom"
        onPressOutside={() => setViewerIndex(null)}
        contentStyle={styles.viewerBackdropContent}
      >
        <ThemedView style={styles.viewerShell}>
          <ThemedView style={[styles.viewerTopBar, { paddingTop: viewerTopPadding }]}>
            <HeaderIconButton
              accessibilityRole="button"
              accessibilityLabel="Foto sluiten"
              onPress={() => setViewerIndex(null)}
              style={styles.viewerCloseButton}
            >
              <MaterialIcons name="close" size={18} color={palette.primary} />
            </HeaderIconButton>
          </ThemedView>

          <ThemedView style={[styles.viewerMediaFrame, { height: viewerFrameHeight }]}>
            <ScrollView
              ref={viewerScrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={handleViewerScroll}
              onScroll={handleViewerScroll}
              scrollEventThrottle={16}
              style={[styles.viewerCarousel, { width: viewerPageWidth }]}
            >
              {photos.map((photo) => {
                return (
                  <ThemedView
                    key={photo.id}
                    style={[styles.viewerPage, { width: viewerPageWidth, height: viewerFrameHeight }]}
                  >
                    <Image
                      source={photo.displaySource}
                      contentFit="contain"
                      style={styles.viewerImage}
                    />
                  </ThemedView>
                );
              })}
            </ScrollView>
          </ThemedView>

          <ThemedView style={[styles.viewerBottomBar, { paddingBottom: viewerBottomPadding }]}>
            <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
              {(viewerIndex ?? 0) + 1} / {photos.length}
            </ThemedText>

            {activePhoto ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Foto verwijderen"
                onPress={() => onRequestDelete(activePhoto)}
                style={styles.viewerDeleteAction}
              >
                <MaterialIcons name="delete" size={18} color={palette.destructiveSoftText} />
                <ThemedText type="caption" style={{ color: palette.destructiveSoftText }}>
                  Verwijderen
                </ThemedText>
              </Pressable>
            ) : null}
          </ThemedView>
        </ThemedView>
      </ModalBackdrop>
    </Modal>
  );
}

export function EntryPhotoFeaturedPreview({
  rawEntryId,
  refreshToken = 0,
  onPhotosChanged,
}: BaseProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const { photos, loading } = useEntryPhotos(rawEntryId, refreshToken);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EntryPhotoAsset | null>(null);
  const [deleting, setDeleting] = useState(false);

  const hasPhotos = photos.length > 0;

  const requestDeleteFromViewer = useCallback((photo: EntryPhotoAsset) => {
    setViewerIndex(null);
    setTimeout(() => setDeleteTarget(photo), 120);
  }, []);

  const handleDeletePhoto = useCallback(async () => {
    const target = deleteTarget;
    if (!target) {
      return;
    }

    setDeleting(true);
    try {
      await deleteEntryPhotoById(target.id);
      setDeleteTarget(null);
      onPhotosChanged?.();
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, onPhotosChanged]);

  if (loading || !hasPhotos) {
    return null;
  }

  return (
    <>
      <Pressable
        accessibilityRole="imagebutton"
        accessibilityLabel="Open eerste foto"
        onPress={() => setViewerIndex(0)}
        style={[styles.featuredWrap, { backgroundColor: palette.surfaceLow }]}
      >
        <Image source={photos[0]?.thumbSource} contentFit="cover" style={styles.featuredImage} />
      </Pressable>

      <EntryPhotoViewer
        photos={photos}
        viewerIndex={viewerIndex}
        setViewerIndex={setViewerIndex}
        onRequestDelete={requestDeleteFromViewer}
      />

      <ConfirmSheet
        visible={Boolean(deleteTarget)}
        title="Foto verwijderen?"
        message="Weet je zeker dat je deze foto wilt verwijderen?"
        actions={[
          {
            key: "cancel",
            label: "Annuleren",
            onPress: () => setDeleteTarget(null),
          },
          {
            key: "confirm",
            label: "Verwijderen",
            tone: "destructive",
            icon: "delete",
            onPress: () => void handleDeletePhoto(),
          },
        ]}
        processing={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeletePhoto()}
      />
    </>
  );
}

export function EntryPhotoGallery({
  rawEntryId,
  refreshToken = 0,
  onPhotosChanged,
}: BaseProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const {
    photos,
    loading,
    error,
    setError,
    loadPhotos,
  } = useEntryPhotos(rawEntryId, refreshToken);

  const [uploading, setUploading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EntryPhotoAsset | null>(null);
  const [deleting, setDeleting] = useState(false);

  const hasPhotos = photos.length > 0;
  const remainingSlots = Math.max(0, MAX_PHOTOS - photos.length);

  const runUpload = useCallback(
    async (assets: { uri: string; width: number; height: number }[]) => {
      if (!assets.length) {
        return;
      }

      setUploading(true);
      setError(null);
      try {
        for (const asset of assets) {
          const prepared = await buildPreparedImageAsset(asset.uri, asset.width, asset.height);
          await uploadEntryPhotoForEntry({
            rawEntryId,
            ...prepared,
            mimeType: "image/jpeg",
          });
        }
        await loadPhotos();
        onPhotosChanged?.();
      } catch (nextError) {
        setError(nextError instanceof Error ? nextError.message : "Foto uploaden mislukte.");
      } finally {
        setUploading(false);
      }
    },
    [loadPhotos, onPhotosChanged, rawEntryId, setError]
  );

  const pickFromLibrary = useCallback(async () => {
    setPickerVisible(false);
    if (remainingSlots <= 0) {
      return;
    }

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError("Toegang tot je fotobibliotheek is nodig om foto's te kiezen.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: remainingSlots > 1,
      selectionLimit: remainingSlots,
    });

    if (result.canceled) {
      return;
    }

    const selected = result.assets
      .slice(0, remainingSlots)
      .map((asset) => ({ uri: asset.uri, width: asset.width ?? 1, height: asset.height ?? 1 }));

    await runUpload(selected);
  }, [remainingSlots, runUpload, setError]);

  const captureFromCamera = useCallback(async () => {
    setPickerVisible(false);
    if (remainingSlots <= 0) {
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setError("Toegang tot je camera is nodig om een foto te maken.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    const first = result.assets[0];
    await runUpload([
      {
        uri: first.uri,
        width: first.width ?? 1,
        height: first.height ?? 1,
      },
    ]);
  }, [remainingSlots, runUpload, setError]);

  const requestDeleteFromViewer = useCallback((photo: EntryPhotoAsset) => {
    setViewerIndex(null);
    setTimeout(() => setDeleteTarget(photo), 120);
  }, []);

  const handleDeletePhoto = useCallback(async () => {
    const target = deleteTarget;
    if (!target) {
      return;
    }

    setDeleting(true);
    try {
      await deleteEntryPhotoById(target.id);
      setDeleteTarget(null);
      await loadPhotos();
      onPhotosChanged?.();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Foto verwijderen mislukte.");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, loadPhotos, onPhotosChanged, setError]);

  const pickerActions = useMemo<ConfirmSheetAction[]>(
    () => [
      {
        key: "camera",
        label: "Foto maken",
        icon: "photo-camera" as const,
        onPress: (): void => {
          void captureFromCamera();
        },
      },
      {
        key: "library",
        label: `Foto's kiezen (${remainingSlots} over)`,
        icon: "photo-library" as const,
        onPress: (): void => {
          void pickFromLibrary();
        },
      },
      {
        key: "cancel",
        label: "Annuleren",
        onPress: (): void => {
          setPickerVisible(false);
        },
      },
    ],
    [captureFromCamera, pickFromLibrary, remainingSlots]
  );

  return (
    <>
      <ThemedView style={styles.sectionWrap}>
        <DetailSectionHeader icon="photo-library" title="Foto's bij dit moment" />

        {loading ? <StateBlock tone="loading" message="Foto's laden..." detail="Even geduld." /> : null}

        {error ? <StateBlock tone="error" message="Foto's zijn nu niet beschikbaar" detail={error} /> : null}

        {!loading && !hasPhotos ? (
          <ThemedView style={[styles.emptyState, { backgroundColor: palette.surfaceLow }]}> 
            <ThemedText type="defaultSemiBold">Bewaar een beeld bij dit moment</ThemedText>
            <ThemedText type="bodySecondary" style={{ color: palette.muted }}>
              Leg een foto vast zodat je dit moment later rustig kunt terugzien.
            </ThemedText>
            <PrimaryButton
              label={uploading ? "Foto verwerken..." : "Foto toevoegen"}
              icon="add-a-photo"
              disabled={uploading || remainingSlots <= 0}
              onPress={() => setPickerVisible(true)}
            />
          </ThemedView>
        ) : null}

        {!loading && hasPhotos ? (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
              {photos.map((photo, index) => (
                <Pressable
                  key={photo.id}
                  accessibilityRole="imagebutton"
                  accessibilityLabel={`Open foto ${index + 1}`}
                  onPress={() => setViewerIndex(index)}
                  style={[styles.thumbWrap, { backgroundColor: palette.surfaceLow }]}
                >
                  <Image source={photo.thumbSource} contentFit="cover" style={styles.thumbImage} />
                </Pressable>
              ))}
            </ScrollView>

            <ThemedView style={styles.galleryMetaRow}>
              <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                {photos.length} / {MAX_PHOTOS} foto&apos;s
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Foto toevoegen"
                disabled={uploading || remainingSlots <= 0}
                onPress={() => setPickerVisible(true)}
                style={styles.addInlineButton}
              >
                <MaterialIcons name="add-a-photo" size={16} color={palette.primary} />
                <ThemedText type="caption" style={{ color: palette.primary }}>
                  Toevoegen
                </ThemedText>
              </Pressable>
            </ThemedView>
          </>
        ) : null}
      </ThemedView>

      <ConfirmSheet
        visible={pickerVisible}
        title="Foto toevoegen"
        message="Kies hoe je een foto wilt toevoegen aan dit moment."
        actions={pickerActions}
        onCancel={() => setPickerVisible(false)}
        onConfirm={() => setPickerVisible(false)}
      />

      <EntryPhotoViewer
        photos={photos}
        viewerIndex={viewerIndex}
        setViewerIndex={setViewerIndex}
        onRequestDelete={requestDeleteFromViewer}
      />

      <ConfirmSheet
        visible={Boolean(deleteTarget)}
        title="Foto verwijderen?"
        message="Weet je zeker dat je deze foto wilt verwijderen?"
        actions={[
          {
            key: "cancel",
            label: "Annuleren",
            onPress: () => setDeleteTarget(null),
          },
          {
            key: "confirm",
            label: "Verwijderen",
            tone: "destructive",
            icon: "delete",
            onPress: () => void handleDeletePhoto(),
          },
        ]}
        processing={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void handleDeletePhoto()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  featuredWrap: {
    borderRadius: radius.lg,
    overflow: "hidden",
    height: 164,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  sectionWrap: {
    gap: spacing.md,
  },
  emptyState: {
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  galleryRow: {
    gap: spacing.sm,
  },
  thumbWrap: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  galleryMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addInlineButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  viewerBackdropContent: {
    flex: 1,
    width: "100%",
  },
  viewerShell: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
  },
  viewerTopBar: {
    width: "100%",
    paddingHorizontal: spacing.sm,
    alignItems: "flex-end",
  },
  viewerMediaFrame: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  viewerCarousel: {
    width: "100%",
  },
  viewerPage: {
    justifyContent: "center",
    alignItems: "center",
  },
  viewerImage: {
    width: "100%",
    height: "100%",
  },
  viewerCloseButton: {
    marginRight: 0,
  },
  viewerBottomBar: {
    width: "100%",
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewerDeleteAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
});
