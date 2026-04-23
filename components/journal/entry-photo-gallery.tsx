import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
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
import { ZoomablePhotoSlide } from "@/components/ui/zoomable-photo-slide";
import { PrimaryButton, StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  deleteEntryPhotoById,
  fetchEntryPhotosByRawEntryId,
  reorderEntryPhotosForEntry,
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
  onPhotosSnapshotChange?: (photos: EntryPhotoAsset[]) => void;
  photosOverride?: EntryPhotoAsset[] | null;
};

const MAX_PHOTOS = 5;
const THUMB_SIZE = 84;
const THUMB_GAP = spacing.sm;
const THUMB_SLOT_WIDTH = THUMB_SIZE + THUMB_GAP;
const DRAG_PLACEHOLDER_SCALE = 0.94;
const LONG_PRESS_DELAY_MS = 220;

function clampIndex(index: number, length: number): number {
  if (length <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(length - 1, index));
}

function reorderPhotos(
  photos: EntryPhotoAsset[],
  fromIndex: number,
  toIndex: number
): EntryPhotoAsset[] {
  if (fromIndex === toIndex) {
    return photos;
  }

  const next = photos.slice();
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) {
    return photos;
  }
  next.splice(toIndex, 0, moved);
  return next;
}

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
  const [zoomedPhotoId, setZoomedPhotoId] = useState<string | null>(null);
  const activePhoto = viewerIndex === null ? null : photos[viewerIndex] ?? null;
  const dragStartIndexRef = useRef(0);

  useEffect(() => {
    if (viewerIndex === null) {
      setZoomedPhotoId(null);
      return;
    }
    dragStartIndexRef.current = viewerIndex;
    setZoomedPhotoId(null);
    const handle = setTimeout(() => {
      viewerScrollRef.current?.scrollTo({
        x: viewerIndex * viewerPageWidth,
        animated: false,
      });
    }, 0);
    return () => clearTimeout(handle);
  }, [viewerIndex, viewerPageWidth]);

  function getNormalizedIndex(offsetX: number) {
    const nextIndex = Math.round(offsetX / viewerPageWidth);
    return Math.max(0, Math.min(photos.length - 1, nextIndex));
  }

  function handleViewerScrollBeginDrag() {
    dragStartIndexRef.current = viewerIndex ?? 0;
  }

  function handleViewerScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const rawIndex = getNormalizedIndex(event.nativeEvent.contentOffset.x);
    const startIndex = dragStartIndexRef.current;
    const boundedIndex =
      Math.abs(rawIndex - startIndex) <= 1
        ? rawIndex
        : startIndex + Math.sign(rawIndex - startIndex);
    const nextIndex = Math.max(0, Math.min(photos.length - 1, boundedIndex));

    if (nextIndex !== rawIndex) {
      viewerScrollRef.current?.scrollTo({
        x: nextIndex * viewerPageWidth,
        animated: true,
      });
    }

    dragStartIndexRef.current = nextIndex;
    setViewerIndex(nextIndex);
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
              bounces={false}
              disableIntervalMomentum
              directionalLockEnabled
              scrollEnabled={!zoomedPhotoId}
              showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={handleViewerScrollBeginDrag}
              onMomentumScrollEnd={handleViewerScrollEnd}
              style={[styles.viewerCarousel, { width: viewerPageWidth }]}
            >
              {photos.map((photo) => {
                return (
                  <ThemedView
                    key={photo.id}
                    style={[styles.viewerPage, { width: viewerPageWidth, height: viewerFrameHeight }]}
                  >
                    <ZoomablePhotoSlide
                      source={photo.displaySource}
                      frameWidth={viewerPageWidth}
                      frameHeight={viewerFrameHeight}
                      imageWidth={photo.displayWidth}
                      imageHeight={photo.displayHeight}
                      onZoomStateChange={(zoomed) => {
                        setZoomedPhotoId(zoomed ? photo.id : null);
                      }}
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
  onPhotosSnapshotChange,
  photosOverride,
}: BaseProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const { photos, loading } = useEntryPhotos(rawEntryId, refreshToken);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EntryPhotoAsset | null>(null);
  const [deleting, setDeleting] = useState(false);

  const effectivePhotos = photosOverride ?? photos;
  const hasPhotos = effectivePhotos.length > 0;
  const isLoading = loading && photosOverride === null;

  useEffect(() => {
    onPhotosSnapshotChange?.(photos);
  }, [onPhotosSnapshotChange, photos]);

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
      onPhotosSnapshotChange?.(photos.filter((photo) => photo.id !== target.id));
      setDeleteTarget(null);
      onPhotosChanged?.();
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, onPhotosChanged, onPhotosSnapshotChange, photos]);

  if (isLoading || !hasPhotos) {
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
        <Image source={effectivePhotos[0]?.thumbSource} contentFit="cover" style={styles.featuredImage} />
        <View style={[styles.thumbnailBadge, { backgroundColor: palette.primaryStrong }]}>
          <MaterialIcons name="image" size={12} color={palette.primaryOn} />
          <ThemedText type="caption" style={[styles.thumbnailBadgeText, { color: palette.primaryOn }]}>
            Thumbnail
          </ThemedText>
        </View>
      </Pressable>

      <EntryPhotoViewer
        photos={effectivePhotos}
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
  onPhotosSnapshotChange,
}: BaseProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const {
    photos,
    setPhotos,
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
  const [draggingPhotoId, setDraggingPhotoId] = useState<string | null>(null);
  const [dragOriginIndex, setDragOriginIndex] = useState<number | null>(null);
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null);
  const dragX = useRef(new Animated.Value(0)).current;
  const dragStartLeftRef = useRef(0);
  const dragSnapshotRef = useRef<EntryPhotoAsset[] | null>(null);
  const suppressPressUntilRef = useRef(0);

  const hasPhotos = photos.length > 0;
  const remainingSlots = Math.max(0, MAX_PHOTOS - photos.length);
  const draggingPhoto =
    draggingPhotoId === null ? null : photos.find((photo) => photo.id === draggingPhotoId) ?? null;

  useEffect(() => {
    onPhotosSnapshotChange?.(photos);
  }, [onPhotosSnapshotChange, photos]);

  const resetDragState = useCallback(() => {
    setDraggingPhotoId(null);
    setDragOriginIndex(null);
    setDragTargetIndex(null);
    dragSnapshotRef.current = null;
    dragStartLeftRef.current = 0;
    dragX.stopAnimation();
    dragX.setValue(0);
  }, [dragX]);

  const persistReorder = useCallback(
    async (previousPhotos: EntryPhotoAsset[], nextPhotos: EntryPhotoAsset[]) => {
      try {
        await reorderEntryPhotosForEntry({
          rawEntryId,
          orderedPhotoIds: nextPhotos.map((photo) => photo.id),
        });
        onPhotosChanged?.();
      } catch (nextError) {
        setPhotos(previousPhotos);
        onPhotosSnapshotChange?.(previousPhotos);
        setError(nextError instanceof Error ? nextError.message : "Volgorde opslaan mislukte.");
      }
    },
    [onPhotosChanged, onPhotosSnapshotChange, rawEntryId, setError, setPhotos]
  );

  const finishDrag = useCallback(
    (cancelled = false) => {
      const previousPhotos = dragSnapshotRef.current ?? photos;
      const fromIndex = dragOriginIndex;
      const toIndex = dragTargetIndex;

      resetDragState();

      if (
        cancelled ||
        fromIndex === null ||
        toIndex === null ||
        fromIndex === toIndex ||
        !previousPhotos[fromIndex]
      ) {
        return;
      }

      const nextPhotos = reorderPhotos(previousPhotos, fromIndex, toIndex);
      setPhotos(nextPhotos);
      onPhotosSnapshotChange?.(nextPhotos);
      void persistReorder(previousPhotos, nextPhotos);
    },
    [
      dragOriginIndex,
      dragTargetIndex,
      onPhotosSnapshotChange,
      persistReorder,
      photos,
      resetDragState,
      setPhotos,
    ]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => draggingPhotoId !== null,
        onMoveShouldSetPanResponderCapture: () => draggingPhotoId !== null,
        onPanResponderMove: (_, gestureState) => {
          if (draggingPhotoId === null) {
            return;
          }

          const maxLeft = Math.max(0, (photos.length - 1) * THUMB_SLOT_WIDTH);
          const nextLeft = Math.max(
            0,
            Math.min(maxLeft, dragStartLeftRef.current + gestureState.dx)
          );
          dragX.setValue(nextLeft);
          setDragTargetIndex(clampIndex(Math.round(nextLeft / THUMB_SLOT_WIDTH), photos.length));
        },
        onPanResponderRelease: () => finishDrag(false),
        onPanResponderTerminate: () => finishDrag(true),
        onPanResponderTerminationRequest: () => false,
      }),
    [dragX, draggingPhotoId, finishDrag, photos.length]
  );

  const startDrag = useCallback(
    (index: number) => {
      if (photos.length < 2) {
        return;
      }

      const photo = photos[index];
      if (!photo) {
        return;
      }

      suppressPressUntilRef.current = Date.now() + 400;
      dragSnapshotRef.current = photos.slice();
      dragStartLeftRef.current = index * THUMB_SLOT_WIDTH;
      dragX.setValue(dragStartLeftRef.current);
      setDragOriginIndex(index);
      setDragTargetIndex(index);
      setDraggingPhotoId(photo.id);
    },
    [dragX, photos]
  );

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
      onPhotosSnapshotChange?.(photos.filter((photo) => photo.id !== target.id));
      setDeleteTarget(null);
      await loadPhotos();
      onPhotosChanged?.();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Foto verwijderen mislukte.");
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, loadPhotos, onPhotosChanged, onPhotosSnapshotChange, photos, setError]);

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
            <ThemedView style={styles.galleryStack}>
              <ScrollView
                horizontal
                scrollEnabled={draggingPhotoId === null}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryRow}
              >
                {photos.map((photo, index) => {
                  const isFirst = index === 0;
                  const isDragging = photo.id === draggingPhotoId;
                  const showPlaceholder = dragTargetIndex === index && draggingPhotoId !== null;

                  return (
                    <View key={photo.id} style={styles.thumbSlot}>
                      {showPlaceholder ? (
                        <View
                          pointerEvents="none"
                          style={[
                            styles.dragPlaceholder,
                            {
                              backgroundColor: palette.surfaceLow,
                              borderColor: palette.primary,
                            },
                          ]}
                        />
                      ) : null}

                      <Pressable
                        accessibilityRole="imagebutton"
                        accessibilityLabel={
                          isFirst ? `Open thumbnail foto ${index + 1}` : `Open foto ${index + 1}`
                        }
                        delayLongPress={LONG_PRESS_DELAY_MS}
                        onLongPress={() => startDrag(index)}
                        onPress={() => {
                          if (Date.now() < suppressPressUntilRef.current || draggingPhotoId !== null) {
                            return;
                          }
                          setViewerIndex(index);
                        }}
                        style={[
                          styles.thumbWrap,
                          {
                            backgroundColor: palette.surfaceLow,
                            opacity: isDragging ? 0.08 : 1,
                            borderWidth: isFirst ? 2 : 0,
                            borderColor: isFirst ? palette.primary : "transparent",
                          },
                        ]}
                      >
                        <Image source={photo.thumbSource} contentFit="cover" style={styles.thumbImage} />
                        {isFirst ? (
                          <View style={[styles.thumbBadge, { backgroundColor: palette.primaryStrong }]}>
                            <MaterialIcons name="image" size={10} color={palette.primaryOn} />
                            <ThemedText
                              type="caption"
                              style={[styles.thumbBadgeText, { color: palette.primaryOn }]}
                            >
                              Thumbnail
                            </ThemedText>
                          </View>
                        ) : null}
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>

              {draggingPhoto && dragOriginIndex !== null ? (
                <View
                  pointerEvents="box-none"
                  style={styles.dragOverlay}
                  {...panResponder.panHandlers}
                >
                  <Animated.View
                    style={[
                      styles.draggedThumb,
                      {
                        backgroundColor: palette.surfaceLow,
                        transform: [{ translateX: dragX }],
                      },
                    ]}
                  >
                    <Image source={draggingPhoto.thumbSource} contentFit="cover" style={styles.thumbImage} />
                    <View style={[styles.thumbBadge, { backgroundColor: palette.primaryStrong }]}>
                      <MaterialIcons name="drag-indicator" size={10} color={palette.primaryOn} />
                      <ThemedText
                        type="caption"
                        style={[styles.thumbBadgeText, { color: palette.primaryOn }]}
                      >
                        {dragTargetIndex === 0 ? "Thumbnail" : "Verplaatsen"}
                      </ThemedText>
                    </View>
                  </Animated.View>
                </View>
              ) : null}
            </ThemedView>

            {photos.length > 1 ? (
              <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
                Houd een foto ingedrukt om de volgorde en thumbnail te veranderen.
              </ThemedText>
            ) : null}

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
  thumbnailBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  thumbnailBadgeText: {
    fontSize: 11,
    lineHeight: 14,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  sectionWrap: {
    gap: spacing.md,
  },
  galleryStack: {
    position: "relative",
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
  thumbSlot: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  thumbWrap: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  dragPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.md,
    borderWidth: 2,
    borderStyle: "dashed",
    opacity: 0.7,
    transform: [{ scale: DRAG_PLACEHOLDER_SCALE }],
  },
  dragOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-start",
  },
  draggedThumb: {
    position: "absolute",
    top: 0,
    left: 0,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.md,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  thumbBadge: {
    position: "absolute",
    left: 6,
    bottom: 6,
    borderRadius: radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  thumbBadgeText: {
    fontSize: 10,
    lineHeight: 12,
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
