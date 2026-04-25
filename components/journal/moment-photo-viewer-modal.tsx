import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { HeaderIconButton } from "@/components/ui/header-icon-button";
import { ModalBackdrop } from "@/components/ui/modal-backdrop";
import { ZoomablePhotoSlide } from "@/components/ui/zoomable-photo-slide";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { type EntryPhotoAsset } from "@/services";
import { getMomentPhotoViewerSwipeState } from "@/src/lib/moment-photo-viewer/presentation";
import { colorTokens, spacing } from "@/theme";

type MomentPhotoViewerModalProps = {
  photos: EntryPhotoAsset[];
  viewerIndex: number | null;
  setViewerIndex: (value: number | null) => void;
  title?: string | null;
  onRequestDelete?: ((photo: EntryPhotoAsset) => void) | null;
};

export function MomentPhotoViewerModal({
  photos,
  viewerIndex,
  setViewerIndex,
  title,
  onRequestDelete,
}: MomentPhotoViewerModalProps) {
  const scheme = useColorScheme() ?? "light";
  const palette = colorTokens[scheme];
  const { width: viewportWidth, height: viewportHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const viewerScrollRef = useRef<ScrollView | null>(null);
  const [zoomedPhotoId, setZoomedPhotoId] = useState<string | null>(null);
  const dragStartIndexRef = useRef(0);

  const viewerPageWidth = Math.max(1, viewportWidth);
  const viewerTopPadding = insets.top + spacing.xs;
  const viewerBottomPadding = Math.max(insets.bottom, spacing.sm);
  const viewerTopControlsHeight = viewerTopPadding + 40;
  const viewerBottomControlsHeight = viewerBottomPadding + 22;
  const viewerFrameHeight = Math.max(
    280,
    viewportHeight - viewerTopControlsHeight - viewerBottomControlsHeight - spacing.lg * 2
  );
  const activePhoto = viewerIndex === null ? null : photos[viewerIndex] ?? null;
  const { hasSwipe, canGoLeft, canGoRight } = getMomentPhotoViewerSwipeState({
    photoCount: photos.length,
    viewerIndex,
  });

  const scrollToIndex = useCallback(
    (nextIndex: number, animated: boolean) => {
      const boundedIndex = Math.max(0, Math.min(photos.length - 1, nextIndex));
      viewerScrollRef.current?.scrollTo({
        x: boundedIndex * viewerPageWidth,
        animated,
      });
      dragStartIndexRef.current = boundedIndex;
      setViewerIndex(boundedIndex);
    },
    [photos.length, viewerPageWidth, setViewerIndex]
  );

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
            <ThemedText
              type="bodySecondary"
              numberOfLines={1}
              style={[styles.viewerTitle, { color: palette.text }]}
            >
              {title?.trim() || "Moment zonder titel"}
            </ThemedText>
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
              scrollEnabled={Platform.OS !== "web" && !zoomedPhotoId}
              showsHorizontalScrollIndicator={false}
              onScrollBeginDrag={handleViewerScrollBeginDrag}
              onMomentumScrollEnd={handleViewerScrollEnd}
              style={[styles.viewerCarousel, { width: viewerPageWidth }]}
            >
              {photos.map((photo) => (
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
                    onRequestPrevious={
                      hasSwipe && canGoLeft
                        ? () => scrollToIndex((viewerIndex ?? 0) - 1, true)
                        : null
                    }
                    onRequestNext={
                      hasSwipe && canGoRight
                        ? () => scrollToIndex((viewerIndex ?? 0) + 1, true)
                        : null
                    }
                    onZoomStateChange={(zoomed) => {
                      setZoomedPhotoId(zoomed ? photo.id : null);
                    }}
                  />
                </ThemedView>
              ))}
            </ScrollView>

            {hasSwipe ? (
              <>
                <View pointerEvents="box-none" style={styles.viewerSideHints}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Vorige foto"
                    disabled={!canGoLeft}
                    onPress={() => scrollToIndex((viewerIndex ?? 0) - 1, true)}
                    style={[
                      styles.viewerEdgeButton,
                      !canGoLeft ? styles.viewerEdgeButtonDisabled : null,
                    ]}
                  >
                    <MaterialIcons
                      name="chevron-left"
                      size={22}
                      color={canGoLeft ? palette.primary : `${palette.mutedSoft}55`}
                    />
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Volgende foto"
                    disabled={!canGoRight}
                    onPress={() => scrollToIndex((viewerIndex ?? 0) + 1, true)}
                    style={[
                      styles.viewerEdgeButton,
                      !canGoRight ? styles.viewerEdgeButtonDisabled : null,
                    ]}
                  >
                    <MaterialIcons
                      name="chevron-right"
                      size={22}
                      color={canGoRight ? palette.primary : `${palette.mutedSoft}55`}
                    />
                  </Pressable>
                </View>
              </>
            ) : null}
          </ThemedView>

          <ThemedView
            style={[
              styles.viewerBottomBar,
              { paddingBottom: viewerBottomPadding },
              !onRequestDelete ? styles.viewerBottomBarCompact : null,
            ]}
          >
            <ThemedText type="caption" style={{ color: palette.mutedSoft }}>
              {(viewerIndex ?? 0) + 1} / {photos.length}
            </ThemedText>

            {activePhoto && onRequestDelete ? (
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

const styles = StyleSheet.create({
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  viewerTitle: {
    flex: 1,
    fontSize: 17,
    lineHeight: 22,
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
  viewerCloseButton: {
    marginRight: 0,
  },
  viewerSideHints: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
  },
  viewerEdgeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  viewerEdgeButtonDisabled: {
    opacity: 0.38,
  },
  viewerBottomBar: {
    width: "100%",
    paddingHorizontal: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  viewerBottomBarCompact: {
    justifyContent: "center",
  },
  viewerDeleteAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
});
