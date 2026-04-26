import { useEffect, useMemo, useRef, useState } from 'react';

export type ViewportKind = 'desktop' | 'tablet' | 'small';
export type DetailRenderMode = 'hidden' | 'split' | 'overlay' | 'fullscreen';

export const DETAIL_PANE_MIN_WIDTH = 320;
const DETAIL_PANE_MAX_WIDTH = 720;
const DETAIL_PANE_DEFAULT_WIDTH = 420;

export function useTaskDetailLayout(selectedTaskId: string | null) {
  const [viewport, setViewport] = useState<ViewportKind>(getViewportKind);
  const [detailOpen, setDetailOpen] = useState<boolean>(getViewportKind() === 'desktop');
  const [detailFullscreen, setDetailFullscreen] = useState(false);
  const [detailPaneWidth, setDetailPaneWidth] = useState<number>(DETAIL_PANE_DEFAULT_WIDTH);
  const [isResizingDetailPane, setIsResizingDetailPane] = useState(false);
  const resizeStartRef = useRef<{ x: number; width: number } | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setViewport(getViewportKind());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!selectedTaskId) {
      setDetailOpen(false);
      setDetailFullscreen(false);
    }
  }, [selectedTaskId]);

  useEffect(() => {
    if (viewport !== 'desktop' && detailFullscreen) {
      setDetailFullscreen(false);
    }
  }, [detailFullscreen, viewport]);

  useEffect(() => {
    if (!isResizingDetailPane) {
      return;
    }

    const onPointerMove = (event: PointerEvent) => {
      const start = resizeStartRef.current;
      if (!start) {
        return;
      }

      const nextWidth = clampDetailPaneWidth(start.width - (event.clientX - start.x));
      setDetailPaneWidth(nextWidth);
    };

    const stopResize = () => {
      resizeStartRef.current = null;
      setIsResizingDetailPane(false);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', stopResize);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', stopResize);
    };
  }, [isResizingDetailPane]);

  const renderMode = useMemo<DetailRenderMode>(() => {
    if (!detailOpen || !selectedTaskId) {
      return 'hidden';
    }

    if (detailFullscreen) {
      return 'fullscreen';
    }

    return 'split';
  }, [detailFullscreen, detailOpen, selectedTaskId, viewport]);

  return {
    viewport,
    detailOpen,
    setDetailOpen,
    detailFullscreen,
    setDetailFullscreen,
    detailPaneWidth,
    renderMode,
    isResizingDetailPane,
    startResize(event: React.PointerEvent<HTMLButtonElement>) {
      resizeStartRef.current = { x: event.clientX, width: detailPaneWidth };
      setIsResizingDetailPane(true);
    },
    closeDetail() {
      setDetailFullscreen(false);
      setDetailOpen(false);
    },
  };
}

export function getViewportKind(): ViewportKind {
  const width = window.innerWidth;
  if (width < 768) {
    return 'small';
  }
  if (width < 1180) {
    return 'tablet';
  }
  return 'desktop';
}

function clampDetailPaneWidth(value: number): number {
  return Math.max(DETAIL_PANE_MIN_WIDTH, Math.min(DETAIL_PANE_MAX_WIDTH, value));
}