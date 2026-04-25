import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  type GestureResponderEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import {
  ConfirmSheet,
  type ConfirmSheetAction,
} from "@/components/feedback/destructive-confirm-sheet";
import { MomentPhotoViewerModal } from "@/components/journal/moment-photo-viewer-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DetailSectionHeader } from "@/components/ui/detail-screen-primitives";
import { PrimaryButton, StateBlock } from "@/components/ui/screen-primitives";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  deleteEntryPhotoById,
  fetchEntryPhotosByRawEntryId,
  reorderEntryPhotosForEntry,
  type EntryPhotoAsset,
  uploadEntryPhotoForEntry,
} from "@/services";
import {
  buildEntryPhotoPreviewSlots,
  createEntryPhotoPhaseError,
  describeEntryPhotoError,
  getEntryPhotoErrorDiagnostics,
} from "@/src/lib/entry-photo-gallery/flow";
import {
  getGalleryDragLeft,
  getGalleryDragTargetIndex,
  reorderGalleryItems,
} from "@/src/lib/entry-photo-gallery/sorting";
import { colorTokens, radius, spacing } from "@/theme";
import { createClientFlowId } from "@/services/function-error";

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
const SORT_HOLD_MS = 120;
const TAP_MOVE_TOLERANCE = 8;
const REORDER_LOG_PREFIX = "[entry-photo:reorder]";

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

function getPointerPageX(event: GestureResponderEvent | any): number {
  const directPageX = event?.nativeEvent?.pageX;
  if (typeof directPageX === "number") {
    return directPageX;
  }

  const changedTouchPageX = event?.nativeEvent?.changedTouches?.[0]?.pageX;
  if (typeof changedTouchPageX === "number") {
    return changedTouchPageX;
  }

  const touchPageX = event?.nativeEvent?.touches?.[0]?.pageX;
  if (typeof touchPageX === "number") {
    return touchPageX;
  }

  return 0;
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
      </Pressable>

      <MomentPhotoViewerModal
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
  } = useEntryPhotos(rawEntryId, refreshToken);

  const [uploading, setUploading] = useState(false);
  const [refreshingPhotos, setRefreshingPhotos] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<EntryPhotoAsset | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [draggingPhotoId, setDraggingPhotoId] = useState<string | null>(null);
  const [dragOriginIndex, setDragOriginIndex] = useState<number | null>(null);
  const [dragTargetIndex, setDragTargetIndex] = useState<number | null>(null);
  const dragX = useRef(new Animated.Value(0)).current;
  const dragStartLeftRef = useRef(0);
  const dragPointerStartPageXRef = useRef(0);
  const dragSnapshotRef = useRef<EntryPhotoAsset[] | null>(null);
  const dragHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragOriginIndexRef = useRef<number | null>(null);
  const dragTargetIndexRef = useRef<number | null>(null);
  const draggingPhotoIdRef = useRef<string | null>(null);
  const suppressNextPressRef = useRef(false);
  const pendingDragIndexRef = useRef<number | null>(null);
  const pendingDragStartPageXRef = useRef(0);
  const pendingDragStartedAtRef = useRef(0);

  const hasPhotos = photos.length > 0;
  const remainingSlots = Math.max(0, MAX_PHOTOS - photos.length);
  const galleryBusy = uploading || refreshingPhotos || reordering || deleting;
  const draggingPhoto =
    draggingPhotoId === null ? null : photos.find((photo) => photo.id === draggingPhotoId) ?? null;
  const previewSlots = useMemo(
    () => buildEntryPhotoPreviewSlots(photos, draggingPhotoId, dragTargetIndex),
    [dragTargetIndex, draggingPhotoId, photos]
  );

  const logReorder = useCallback(
    (
      level: "info" | "warn" | "error",
      event: string,
      details: Record<string, unknown>
    ) => {
      const logger =
        level === "error" ? console.error : level === "warn" ? console.warn : console.info;
      logger(REORDER_LOG_PREFIX, event, details);
    },
    []
  );

  useEffect(() => {
    onPhotosSnapshotChange?.(photos);
  }, [onPhotosSnapshotChange, photos]);

  const applyConfirmedPhotos = useCallback(
    (nextPhotos: EntryPhotoAsset[]) => {
      setPhotos(nextPhotos);
      onPhotosSnapshotChange?.(nextPhotos);
    },
    [onPhotosSnapshotChange, setPhotos]
  );

  const refreshConfirmedPhotos = useCallback(
    async (
      phase:
        | "upload_post_refresh"
        | "delete_post_refresh"
        | "reorder_retry_refetch"
        | "reorder_post_refresh"
    ) => {
      setRefreshingPhotos(true);
      try {
        const nextPhotos = await fetchEntryPhotosByRawEntryId(rawEntryId);
        applyConfirmedPhotos(nextPhotos);
        return nextPhotos;
      } catch (nextError) {
        throw createEntryPhotoPhaseError(phase, nextError, "Foto's vernieuwen mislukte.");
      } finally {
        setRefreshingPhotos(false);
      }
    },
    [applyConfirmedPhotos, rawEntryId]
  );

  const clearDragHoldTimer = useCallback(() => {
    if (dragHoldTimerRef.current) {
      clearTimeout(dragHoldTimerRef.current);
      dragHoldTimerRef.current = null;
    }
  }, []);

  const resetDragState = useCallback(() => {
    clearDragHoldTimer();
    draggingPhotoIdRef.current = null;
    dragOriginIndexRef.current = null;
    dragTargetIndexRef.current = null;
    pendingDragIndexRef.current = null;
    setDraggingPhotoId(null);
    setDragOriginIndex(null);
    setDragTargetIndex(null);
    dragSnapshotRef.current = null;
    dragStartLeftRef.current = 0;
    dragPointerStartPageXRef.current = 0;
    dragX.stopAnimation();
    dragX.setValue(0);
  }, [clearDragHoldTimer, dragX]);

  useEffect(() => clearDragHoldTimer, [clearDragHoldTimer]);

  const persistReorder = useCallback(
    async (
      previousPhotos: EntryPhotoAsset[],
      nextPhotos: EntryPhotoAsset[],
      dragMeta: { originIndex: number; targetIndex: number }
    ) => {
      const flowId = createClientFlowId("entry-photo");
      const previousOrder = previousPhotos.map((photo) => photo.id);
      const nextOrder = nextPhotos.map((photo) => photo.id);

      logReorder("info", "start", {
        flowId,
        rawEntryId,
        originIndex: dragMeta.originIndex,
        targetIndex: dragMeta.targetIndex,
        previousOrder,
        nextOrder,
      });

      setReordering(true);
      try {
        await reorderEntryPhotosForEntry({
          rawEntryId,
          orderedPhotoIds: nextOrder,
          flowId,
          diagnostics: {
            flowId,
            rawEntryId,
            originIndex: dragMeta.originIndex,
            targetIndex: dragMeta.targetIndex,
            previousOrder,
            nextOrder,
          },
        });
        await refreshConfirmedPhotos("reorder_post_refresh");
        logReorder("info", "success", {
          flowId,
          rawEntryId,
          originIndex: dragMeta.originIndex,
          targetIndex: dragMeta.targetIndex,
          nextOrder,
        });
        onPhotosChanged?.();
      } catch (nextError) {
        const classified = describeEntryPhotoError(nextError, "Nieuwe volgorde opslaan mislukte.");
        const diagnostics = getEntryPhotoErrorDiagnostics(nextError);

        logReorder("error", "persist_failed", {
          flowId,
          rawEntryId,
          originIndex: dragMeta.originIndex,
          targetIndex: dragMeta.targetIndex,
          previousOrder,
          nextOrder,
          phase: classified.phase,
          detail: classified.detail,
          ...diagnostics,
        });

        if (classified.retryableReorderMismatch) {
          try {
            logReorder("warn", "retry_after_refetch", {
              flowId,
              rawEntryId,
              originIndex: dragMeta.originIndex,
              targetIndex: dragMeta.targetIndex,
              previousOrder,
              nextOrder,
              phase: classified.phase,
              detail: classified.detail,
              ...diagnostics,
            });
            await refreshConfirmedPhotos("reorder_retry_refetch");
            await reorderEntryPhotosForEntry({
              rawEntryId,
              orderedPhotoIds: nextOrder,
              flowId,
              diagnostics: {
                flowId,
                rawEntryId,
                originIndex: dragMeta.originIndex,
                targetIndex: dragMeta.targetIndex,
                previousOrder,
                nextOrder,
              },
            });
            await refreshConfirmedPhotos("reorder_post_refresh");
            logReorder("info", "retry_success", {
              flowId,
              rawEntryId,
              originIndex: dragMeta.originIndex,
              targetIndex: dragMeta.targetIndex,
              nextOrder,
            });
            onPhotosChanged?.();
            return;
          } catch (retryError) {
            const retryDetail = describeEntryPhotoError(
              retryError,
              "Volgorde opnieuw opslaan na herstel mislukte."
            );
            logReorder("error", "retry_failed", {
              flowId,
              rawEntryId,
              originIndex: dragMeta.originIndex,
              targetIndex: dragMeta.targetIndex,
              previousOrder,
              nextOrder,
              phase: retryDetail.phase,
              detail: retryDetail.detail,
              ...getEntryPhotoErrorDiagnostics(retryError),
            });
            setError(retryDetail.detail);
            return;
          }
        }

        applyConfirmedPhotos(previousPhotos);
        setError(classified.detail);
      } finally {
        setReordering(false);
      }
    },
    [applyConfirmedPhotos, logReorder, onPhotosChanged, rawEntryId, refreshConfirmedPhotos, setError]
  );

  const finishDrag = useCallback(
    (cancelled = false) => {
      const previousPhotos = dragSnapshotRef.current ?? photos;
      const fromIndex = dragOriginIndexRef.current;
      const toIndex = dragTargetIndexRef.current;

      if (
        cancelled ||
        fromIndex === null ||
        toIndex === null ||
        fromIndex === toIndex ||
        !previousPhotos[fromIndex]
      ) {
        resetDragState();
        return;
      }

      const nextPhotos = reorderGalleryItems(previousPhotos, fromIndex, toIndex);
      applyConfirmedPhotos(nextPhotos);
      resetDragState();
      void persistReorder(previousPhotos, nextPhotos, {
        originIndex: fromIndex,
        targetIndex: toIndex,
      });
    },
    [applyConfirmedPhotos, persistReorder, photos, resetDragState]
  );

  const startDrag = useCallback(
    (index: number) => {
      if (photos.length < 2) {
        return;
      }
      if (galleryBusy) {
        return;
      }

      const photo = photos[index];
      if (!photo) {
        return;
      }

      clearDragHoldTimer();
      dragSnapshotRef.current = photos.slice();
      dragStartLeftRef.current = index * THUMB_SLOT_WIDTH;
      dragPointerStartPageXRef.current = pendingDragStartPageXRef.current;
      dragOriginIndexRef.current = index;
      dragTargetIndexRef.current = index;
      draggingPhotoIdRef.current = photo.id;
      dragX.setValue(dragStartLeftRef.current);
      setDragOriginIndex(index);
      setDragTargetIndex(index);
      setDraggingPhotoId(photo.id);
    },
    [clearDragHoldTimer, dragX, galleryBusy, photos]
  );

  const updateDragPosition = useCallback(
    (pageX: number) => {
      if (draggingPhotoIdRef.current === null) {
        return;
      }

      const nextLeft = getGalleryDragLeft({
        originLeft: dragStartLeftRef.current,
        pointerStartPageX: dragPointerStartPageXRef.current,
        pointerPageX: pageX,
        itemCount: photos.length,
        slotWidth: THUMB_SLOT_WIDTH,
      });
      const nextTargetIndex = getGalleryDragTargetIndex({
        dragLeft: nextLeft,
        itemCount: photos.length,
        slotWidth: THUMB_SLOT_WIDTH,
      });

      dragX.setValue(nextLeft);
      if (dragTargetIndexRef.current !== nextTargetIndex) {
        dragTargetIndexRef.current = nextTargetIndex;
        setDragTargetIndex(nextTargetIndex);
      }
    },
    [dragX, photos.length]
  );

  const handleThumbResponderGrant = useCallback(
    (index: number, event: GestureResponderEvent) => {
      clearDragHoldTimer();
      pendingDragIndexRef.current = index;
      pendingDragStartPageXRef.current = getPointerPageX(event);
      pendingDragStartedAtRef.current = Date.now();
      suppressNextPressRef.current = false;
      dragHoldTimerRef.current = setTimeout(() => startDrag(index), SORT_HOLD_MS);
    },
    [clearDragHoldTimer, startDrag]
  );

  const handleThumbResponderMove = useCallback(
    (index: number, event: GestureResponderEvent) => {
      const pageX = getPointerPageX(event);

      if (
        draggingPhotoIdRef.current === null &&
        pendingDragIndexRef.current === index &&
        Date.now() - pendingDragStartedAtRef.current >= SORT_HOLD_MS
      ) {
        startDrag(index);
      }

      updateDragPosition(pageX);
    },
    [startDrag, updateDragPosition]
  );

  const handleThumbResponderRelease = useCallback(
    (index: number, event: GestureResponderEvent) => {
      const wasDragging = draggingPhotoIdRef.current !== null;
      const movedDistance = Math.abs(
        getPointerPageX(event) - pendingDragStartPageXRef.current
      );

      clearDragHoldTimer();

      if (wasDragging) {
        suppressNextPressRef.current = true;
        updateDragPosition(getPointerPageX(event));
        finishDrag(false);
        return;
      }

      resetDragState();
      if (movedDistance > TAP_MOVE_TOLERANCE) {
        suppressNextPressRef.current = true;
      }
    },
    [clearDragHoldTimer, finishDrag, resetDragState, updateDragPosition]
  );

  const handleThumbResponderTerminate = useCallback(() => {
    clearDragHoldTimer();
    suppressNextPressRef.current = true;
    if (draggingPhotoIdRef.current !== null) {
      finishDrag(true);
      return;
    }
    resetDragState();
  }, [clearDragHoldTimer, finishDrag, resetDragState]);

  const handleThumbPress = useCallback(
    (index: number) => {
      if (suppressNextPressRef.current || galleryBusy) {
        suppressNextPressRef.current = false;
        return;
      }

      setViewerIndex(index);
    },
    [galleryBusy]
  );

  const shouldBlockResponderTermination = useCallback(
    () => draggingPhotoIdRef.current === null,
    []
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
          let prepared: PreparedImageAsset;
          try {
            prepared = await buildPreparedImageAsset(asset.uri, asset.width, asset.height);
          } catch (nextError) {
            throw createEntryPhotoPhaseError(
              "upload_prepare",
              nextError,
              "Foto voorbereiden mislukte."
            );
          }

          await uploadEntryPhotoForEntry({
            rawEntryId,
            ...prepared,
            mimeType: "image/jpeg",
          });
        }
        await refreshConfirmedPhotos("upload_post_refresh");
        onPhotosChanged?.();
      } catch (nextError) {
        const classified = describeEntryPhotoError(nextError, "Foto uploaden mislukte.");
        setError(classified.detail);
      } finally {
        setUploading(false);
      }
    },
    [onPhotosChanged, rawEntryId, refreshConfirmedPhotos, setError]
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
    if (galleryBusy) {
      return;
    }
    setViewerIndex(null);
    setTimeout(() => setDeleteTarget(photo), 120);
  }, [galleryBusy]);

  const handleDeletePhoto = useCallback(async () => {
    const target = deleteTarget;
    if (!target || galleryBusy) {
      return;
    }

    setDeleting(true);
    try {
      await deleteEntryPhotoById(target.id);
      setDeleteTarget(null);
      await refreshConfirmedPhotos("delete_post_refresh");
      onPhotosChanged?.();
    } catch (nextError) {
      const classified = describeEntryPhotoError(nextError, "Foto verwijderen mislukte.");
      setError(classified.detail);
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, galleryBusy, onPhotosChanged, refreshConfirmedPhotos, setError]);

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
        {refreshingPhotos && !loading ? (
          <StateBlock tone="loading" message="Foto's vernieuwen..." detail="Even geduld." />
        ) : null}

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
              disabled={galleryBusy || remainingSlots <= 0}
              onPress={() => {
                if (!galleryBusy) {
                  setPickerVisible(true);
                }
              }}
            />
          </ThemedView>
        ) : null}

        {!loading && hasPhotos ? (
          <>
            <ThemedView style={styles.galleryStack}>
              <ScrollView
                horizontal
                scrollEnabled={draggingPhotoId === null && !galleryBusy}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryRow}
              >
                {previewSlots.map((slot, index) => {
                  const photo = slot.item;
                  const originalIndex = photos.findIndex((item) => item.id === photo.id);
                  const isFirst = index === 0;
                  const isDragging = photo.id === draggingPhotoId;

                  return (
                    <View
                      key={slot.isPlaceholder ? `${photo.id}-placeholder` : photo.id}
                      style={styles.thumbSlot}
                    >
                      {slot.isPlaceholder ? (
                        <View
                          pointerEvents="none"
                          testID="entry-photo-drag-placeholder"
                          style={[
                            styles.dragPlaceholder,
                            {
                              backgroundColor: palette.surfaceLow,
                              borderColor: palette.primary,
                            },
                          ]}
                        />
                      ) : null}

                      {!slot.isPlaceholder ? (
                        <Pressable
                          accessible
                          accessibilityRole="imagebutton"
                          accessibilityLabel={
                            isFirst ? `Open thumbnail foto ${index + 1}` : `Open foto ${index + 1}`
                          }
                          accessibilityHint="Houd kort vast en sleep om de volgorde te wijzigen."
                          testID={`entry-photo-thumb-${photo.id}`}
                          delayLongPress={SORT_HOLD_MS}
                          onPress={() => handleThumbPress(originalIndex)}
                          onPressIn={(event) => handleThumbResponderGrant(originalIndex, event as any)}
                          onLongPress={() => startDrag(originalIndex)}
                          onPressOut={(event) => handleThumbResponderRelease(originalIndex, event as any)}
                          onStartShouldSetResponder={() => !galleryBusy}
                          onMoveShouldSetResponder={() => !galleryBusy}
                          onResponderGrant={(event) => handleThumbResponderGrant(originalIndex, event)}
                          onResponderMove={(event) => handleThumbResponderMove(originalIndex, event)}
                          onResponderRelease={(event) => handleThumbResponderRelease(originalIndex, event)}
                          onResponderTerminate={handleThumbResponderTerminate}
                          onResponderTerminationRequest={shouldBlockResponderTermination}
                          onTouchStart={(event) => handleThumbResponderGrant(originalIndex, event as any)}
                          onTouchMove={(event) => handleThumbResponderMove(originalIndex, event as any)}
                          onTouchEnd={(event) => handleThumbResponderRelease(originalIndex, event as any)}
                          onTouchCancel={handleThumbResponderTerminate}
                          disabled={galleryBusy}
                          {...(Platform.OS === "web"
                            ? ({
                                onMouseDown: (event: any) =>
                                  handleThumbResponderGrant(originalIndex, event),
                                onMouseMove: (event: any) =>
                                  handleThumbResponderMove(originalIndex, event),
                                onMouseUp: (event: any) =>
                                  handleThumbResponderRelease(originalIndex, event),
                                onMouseLeave: handleThumbResponderTerminate,
                              } as any)
                            : null)}
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
                              <MaterialIcons name="image" size={8} color={palette.primaryOn} />
                            </View>
                          ) : null}
                        </Pressable>
                      ) : null}
                    </View>
                  );
                })}
              </ScrollView>

              {draggingPhoto && dragOriginIndex !== null ? (
                <View
                  pointerEvents="none"
                  style={styles.dragOverlay}
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
                      <MaterialIcons name="drag-indicator" size={8} color={palette.primaryOn} />
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
                disabled={galleryBusy || remainingSlots <= 0}
                onPress={() => {
                  if (!galleryBusy) {
                    setPickerVisible(true);
                  }
                }}
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

      <MomentPhotoViewerModal
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
    left: 4,
    bottom: 4,
    width: 22,
    height: 22,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
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
});
