import React, { useEffect, useMemo, useRef, useState } from 'react';
import { STATUS_LABELS, WORKSTREAM_LABELS } from '../../src/tasks/constants';
import type {
  BoardSnapshot,
  EpicViewModel,
  TaskKind,
  TaskCardViewModel,
  TaskPriority,
  TaskSort,
  TaskStatus,
  TaskWorkstream,
} from '../../src/tasks/types';
import {
  buildMovePlan,
  computeInsertIndex,
  getDropPlacementFromPointer,
  type DropPlacement,
} from '../../src/tasks/dnd-policy';
import {
  applySortDirection,
  directionArrow,
  isColumnActive,
  nextSortStateFromHeader,
  type ListSortColumn,
  type SortDirection,
} from '../../src/tasks/list-sort-controls';
import { sortTaskCards } from '../../src/tasks/sort-policy';
import {
  activeAgentLabel,
  checklistProgressTone,
  compactChecklistProgressLabel,
  formatLastChangeDate,
} from '../../src/tasks/task-ux';
import type { HostToWebviewMessage } from '../../src/webview-bridge/messages';
import {
  DETAIL_PANE_MIN_WIDTH,
  getViewportKind,
  type DetailRenderMode,
  useTaskDetailLayout,
} from './use-task-detail-layout';
import { vscode } from './vscode';

type ViewMode = 'board' | 'list' | 'epics' | 'settings';
type DueFilter = 'all' | 'today' | 'overdue' | 'no_date';
type HierarchyFilter = 'all' | 'has_epic' | 'no_epic' | 'has_subtasks' | 'blocked' | 'ready_to_start';
const CLICK_DRAG_SUPPRESSION_MS = 180;

interface Filters {
  status: 'all' | TaskStatus;
  priority: 'all' | TaskPriority;
  tag: 'all' | string;
  workstream: 'all' | TaskWorkstream;
  due: DueFilter;
  hierarchy: HierarchyFilter;
  onlyOpen: boolean;
  onlyChecklistOpen: boolean;
}

interface DragState {
  taskId: string;
  sourceStatus: TaskStatus;
}

interface DropIndicatorState {
  status: TaskStatus;
  index: number;
  cardId: string | null;
  placement: 'before' | 'after' | 'between';
}

interface ListDropIndicatorState {
  targetTaskId: string;
  placement: 'before' | 'after';
}

interface MetadataFormState {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  taskKind: TaskKind;
  summary: string;
  tags: string;
  dueDate: string;
}

const EMPTY_FILTERS: Filters = {
  status: 'all',
  priority: 'all',
  tag: 'all',
  workstream: 'all',
  due: 'all',
  hierarchy: 'all',
  onlyOpen: true,
  onlyChecklistOpen: false,
};

const REFRESH_SUCCESS_MS = 1200;
const VIEW_TITLES: Record<ViewMode, string> = {
  board: 'Board',
  list: 'List',
  epics: 'Epics',
  settings: 'Settings',
};

export function App(): React.JSX.Element {
  const [snapshot, setSnapshot] = useState<BoardSnapshot | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('board');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<TaskSort>('manual');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicatorState | null>(null);
  const [listDropIndicator, setListDropIndicator] = useState<ListDropIndicatorState | null>(null);
  const [formState, setFormState] = useState<MetadataFormState | null>(null);
  const [formTaskId, setFormTaskId] = useState<string | null>(null);
  const [pendingDiskChanges, setPendingDiskChanges] = useState(false);
  const [detailMenuOpen, setDetailMenuOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [pendingCloseAfterSave, setPendingCloseAfterSave] = useState(false);
  const [pendingSelectedTaskId, setPendingSelectedTaskId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [refreshState, setRefreshState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const refreshResetTimeoutRef = useRef<number | null>(null);
  const hasHydratedSortRef = useRef(false);
  const moveDispatchLockRef = useRef(false);
  const suppressSelectionUntilRef = useRef(0);
  const {
    viewport,
    detailOpen,
    setDetailOpen,
    detailFullscreen,
    setDetailFullscreen,
    detailPaneWidth,
    renderMode,
    isResizingDetailPane,
    startResize,
    closeDetail,
  } = useTaskDetailLayout(selectedTaskId);

  const detailMode = renderMode === 'split' ? 'split' : 'overlay';
  const isFullscreenDetail = renderMode === 'fullscreen';
  const effectiveFilters = useMemo(
    () => getEffectiveFilters(filters, activeView),
    [activeView, filters],
  );

  useEffect(() => {
    if (!selectedTaskId) {
      setDetailMenuOpen(false);
      setCloseConfirmOpen(false);
      setPendingCloseAfterSave(false);
      setDeleteConfirmOpen(false);
      setArchiveConfirmOpen(false);
    }
  }, [selectedTaskId]);

  useEffect(
    () => () => {
      if (refreshResetTimeoutRef.current !== null) {
        window.clearTimeout(refreshResetTimeoutRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const handler = (event: MessageEvent<HostToWebviewMessage>) => {
      const message = event.data;
      if (message.type === 'hydrateBoard') {
        setSnapshot(message.snapshot);
        if (!hasHydratedSortRef.current) {
          setSort(message.snapshot.sort);
          hasHydratedSortRef.current = true;
        }
        if (message.view) {
          setActiveView(message.view);
        }
        const requestedTaskId = message.focusTaskId ?? selectedTaskId;
        const requestedTaskStillExists = requestedTaskId
          ? message.snapshot.allCards.some((card) => card.id === requestedTaskId)
          : false;
        if (requestedTaskStillExists && requestedTaskId) {
          setSelectedTaskId(requestedTaskId);
          if (message.focusTaskId && viewport !== 'desktop') {
            setDetailOpen(true);
          }
        } else if (message.snapshot.allCards[0]) {
          setSelectedTaskId(message.snapshot.allCards[0].id);
        } else {
          setSelectedTaskId(null);
          setDetailOpen(false);
        }
        setError(null);
        return;
      }

      if (message.type === 'refreshStarted') {
        setRefreshState('loading');
        setError(null);
        return;
      }

      if (message.type === 'refreshCompleted') {
        setRefreshState('success');
        if (refreshResetTimeoutRef.current !== null) {
          window.clearTimeout(refreshResetTimeoutRef.current);
        }
        refreshResetTimeoutRef.current = window.setTimeout(() => {
          setRefreshState('idle');
          refreshResetTimeoutRef.current = null;
        }, REFRESH_SUCCESS_MS);
        return;
      }

      if (message.type === 'refreshFailed') {
        setRefreshState('error');
        setError(message.message);
        return;
      }

      if (message.type === 'saveStarted') {
        setSavingTaskId(message.taskId ?? 'global');
        setNotice('Opslaan...');
        setError(null);
        return;
      }

      if (message.type === 'saveCompleted') {
        setSavingTaskId(null);
        setNotice(message.message);
        setError(null);
        if (pendingCloseAfterSave) {
          setDetailOpen(false);
          setCloseConfirmOpen(false);
          setPendingCloseAfterSave(false);
        }
        if (pendingSelectedTaskId) {
          setSelectedTaskId(pendingSelectedTaskId);
          setPendingSelectedTaskId(null);
          setDetailOpen(true);
        }
        return;
      }

      if (message.type === 'saveFailed') {
        setSavingTaskId(null);
        setError(message.message);
        setPendingCloseAfterSave(false);
        return;
      }

      if (message.type === 'conflictDetected') {
        setSavingTaskId(null);
        setError(message.message);
        setPendingCloseAfterSave(false);
        return;
      }

      if (message.type === 'switchView') {
        setActiveView(message.view);
      }
    };

    window.addEventListener('message', handler);
    vscode.postMessage({ type: 'ready' });

    return () => window.removeEventListener('message', handler);
  }, [pendingCloseAfterSave, pendingSelectedTaskId, selectedTaskId]);

  const tags = useMemo(() => {
    const values = new Set<string>();
    snapshot?.allCards.forEach((card) => {
      card.tags.forEach((tag) => values.add(tag));
    });
    return [...values].sort((left, right) => left.localeCompare(right));
  }, [snapshot]);

  const workstreams = useMemo(() => {
    const values = new Set<TaskWorkstream>();
    snapshot?.allCards.forEach((card) => {
      if (card.workstream) {
        values.add(card.workstream);
      }
    });
    return [...values].sort((left, right) => left.localeCompare(right));
  }, [snapshot]);

  const filteredCards = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    return sortTaskCards(
      snapshot.allCards.filter((card) => matchesFilters(card, search, effectiveFilters)),
      sort,
    );
  }, [effectiveFilters, search, snapshot, sort]);
  const listCards = useMemo(
    () => applySortDirection(filteredCards, sortDirection),
    [filteredCards, sortDirection],
  );
  const cardMap = useMemo(
    () => new Map(snapshot?.allCards.map((card) => [card.id, card]) ?? []),
    [snapshot?.allCards],
  );
  const epics = useMemo(() => snapshot?.epics ?? [], [snapshot]);
  const visibleEpics = useMemo(
    () =>
      epics.filter((epic) => {
        const linkedCards = epic.linkedTaskIds
          .map((taskId) => cardMap.get(taskId))
          .filter((card): card is TaskCardViewModel => Boolean(card))
          .filter((card) => matchesFilters(card, search, effectiveFilters));

        return linkedCards.length > 0 || matchesEpicSearch(epic, search);
      }),
    [cardMap, effectiveFilters, epics, search],
  );

  const visibleColumns = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    return snapshot.columns.map((column) => ({
      ...column,
      cards: filteredCards.filter((card) => card.status === column.key),
    }));
  }, [filteredCards, snapshot]);

  const selectedTask =
    filteredCards.find((card) => card.id === selectedTaskId) ??
    snapshot?.allCards.find((card) => card.id === selectedTaskId) ??
    null;

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const typing =
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement ||
        activeElement instanceof HTMLSelectElement;
      if (typing) {
        return;
      }

      if (event.key === '/') {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        vscode.postMessage({ type: 'createTask', status: 'ready' });
        return;
      }

      if (event.key.toLowerCase() === 'e' && selectedTask) {
        event.preventDefault();
        setDetailOpen(true);
        titleRef.current?.focus();
        return;
      }

      if (event.key === 'Escape' && detailOpen) {
        event.preventDefault();
        requestClosePanel();
        return;
      }

      if (event.key === 'Enter' && selectedTask && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        vscode.postMessage({ type: 'openSourceFile', taskId: selectedTask.id });
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [detailMode, detailOpen, selectedTask]);

  useEffect(() => {
    if (!selectedTask) {
      setFormState(null);
      setFormTaskId(null);
      setPendingDiskChanges(false);
      return;
    }

    const incomingFormState = toMetadataFormState(selectedTask);
    const hasUnsavedChanges = isFormDirty(selectedTask, formState);
    if (formTaskId !== selectedTask.id) {
      setFormState(incomingFormState);
      setFormTaskId(selectedTask.id);
      setPendingDiskChanges(false);
      return;
    }

    if (hasUnsavedChanges) {
      setPendingDiskChanges(true);
      return;
    }

    setFormState(incomingFormState);
    setPendingDiskChanges(false);
  }, [selectedTask?.id, selectedTask?.version.hash, selectedTask?.version.mtimeMs, formState, formTaskId]);

  useEffect(() => {
    setDetailMenuOpen(false);
    setCloseConfirmOpen(false);
    setPendingCloseAfterSave(false);
    setDeleteConfirmOpen(false);
    setArchiveConfirmOpen(false);
  }, [selectedTask?.id]);

  useEffect(() => {
    if (!detailMenuOpen) {
      return;
    }

    const onGlobalClick = () => setDetailMenuOpen(false);
    window.addEventListener('click', onGlobalClick);
    return () => window.removeEventListener('click', onGlobalClick);
  }, [detailMenuOpen]);

  const dragBlockedByFiltering = hasActiveFiltering(search, effectiveFilters, activeView);
  const dragEnabled = !dragBlockedByFiltering;
  const listDragEnabled = activeView === 'list' && !dragBlockedByFiltering;
  const formDirty = isFormDirty(selectedTask, formState);

  if (!snapshot) {
    return <div className="state-shell">Taken laden...</div>;
  }

  return (
    <div className={`app-shell viewport-${viewport} detail-${detailMode} ${isFullscreenDetail ? 'detail-fullscreen' : ''}`}>
      <aside className="icon-rail">
        <IconButton active={activeView === 'board'} icon="▥" label="Board" onClick={() => switchView('board')} />
        <IconButton active={activeView === 'list'} icon="☰" label="List" onClick={() => switchView('list')} />
        <IconButton active={activeView === 'epics'} icon="◎" label="Epics" onClick={() => switchView('epics')} />
        <IconButton active={activeView === 'settings'} icon="⚙" label="Settings" onClick={() => switchView('settings')} />
        <button
          className={`rail-button rail-icon-button refresh-button icon-only ${refreshState}`}
          onClick={handleRefresh}
          title={refreshButtonTitle(refreshState)}
          aria-label={refreshButtonTitle(refreshState)}
          disabled={refreshState === 'loading'}
        >
          <span className="rail-button-icon" aria-hidden="true">↻</span>
        </button>
      </aside>

      <main className="workspace-shell">
        <header className="topbar">
          <div className="topbar-main">
            <div className="topbar-title-wrap">
              <div className="topbar-title">{VIEW_TITLES[activeView]}</div>
              <div className="eyebrow">Budio Workspace</div>
            </div>

            <div className="topbar-status-center">
              {activeView === 'board' && !dragEnabled ? (
                <StatusChip>Board drag/drop tijdelijk uit bij actieve search/filters</StatusChip>
              ) : null}
              {activeView === 'list' && !listDragEnabled ? (
                <StatusChip>List drag/drop tijdelijk uit bij actieve search/filters</StatusChip>
              ) : null}
              {savingTaskId ? <StatusChip>Opslaan...</StatusChip> : null}
              {pendingDiskChanges ? <StatusChip>Nieuwe disk-wijzigingen beschikbaar (je edits blijven behouden)</StatusChip> : null}
              {notice ? <StatusChip>{notice}</StatusChip> : null}
              {error ? <StatusChip danger>{error}</StatusChip> : null}
            </div>

            <div className="topbar-main-actions">
              <button
                className="primary-button"
                onClick={() => vscode.postMessage({ type: 'createTask', status: 'ready' })}
              >
                Nieuwe taak
              </button>
              <div className="topbar-filter-sort">
                <button className={`ghost-button ${filtersOpen ? 'active' : ''}`} onClick={() => setFiltersOpen((open) => !open)}>
                  Filter
                </button>
                {activeView === 'list' ? (
                  <select
                    aria-label="Sortering"
                    value={sort}
                    onChange={(event) => applySortChange(event.target.value as TaskSort)}
                    className="topbar-sort-select"
                    title="Sortering"
                  >
                    <option value="manual">Manual</option>
                    <option value="lane_order">Lane-volgorde</option>
                    <option value="status">Status</option>
                    <option value="due_date">Due date</option>
                    <option value="priority">Priority</option>
                    <option value="progress">Percentage</option>
                    <option value="updated_at">Recent gewijzigd</option>
                    <option value="alphabetical">Alfabetisch</option>
                  </select>
                ) : null}
              </div>
              <button
                className={`ghost-button refresh-button icon-only ${refreshState}`}
                onClick={handleRefresh}
                title={refreshButtonTitle(refreshState)}
                aria-label={refreshButtonTitle(refreshState)}
                disabled={refreshState === 'loading'}
              >
                <span aria-hidden="true">↻</span>
              </button>
            </div>
          </div>

          <div className="topbar-search-row">
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Zoek op titel, tag of body..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <div className="header-stats">
              <span className="header-stat header-stat-total">
                <span className="header-stat-dot" aria-hidden="true" />
                {snapshot.totalTasks} taken
              </span>
              <span className="header-stat header-stat-open">
                <span className="header-stat-dot" aria-hidden="true" />
                {snapshot.openTaskCount} open
              </span>
              <span className="header-stat header-stat-done">
                <span className="header-stat-dot" aria-hidden="true" />
                {snapshot.doneTaskCount} done
              </span>
            </div>
          </div>

          {filtersOpen ? (
            <div className="filter-panel">
              <div className="filter-grid">
                <label>
                  <span>Status</span>
                  <select
                    value={filters.status}
                    onChange={(event) => updateFilters({ status: event.target.value as Filters['status'] })}
                  >
                    <option value="all">Alle statussen</option>
                    {snapshot.settings.columns.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Prioriteit</span>
                  <select
                    value={filters.priority}
                    onChange={(event) => updateFilters({ priority: event.target.value as Filters['priority'] })}
                  >
                    <option value="all">Alle prioriteiten</option>
                    <option value="p1">P1</option>
                    <option value="p2">P2</option>
                    <option value="p3">P3</option>
                  </select>
                </label>
                <label>
                  <span>Tag</span>
                  <select value={filters.tag} onChange={(event) => updateFilters({ tag: event.target.value })}>
                    <option value="all">Alle tags</option>
                    {tags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Domein</span>
                  <select
                    value={filters.workstream}
                    onChange={(event) => updateFilters({ workstream: event.target.value as Filters['workstream'] })}
                  >
                    <option value="all">Alle domeinen</option>
                    {workstreams.map((workstream) => (
                      <option key={workstream} value={workstream}>
                        {WORKSTREAM_LABELS[workstream]}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Datum</span>
	                  <select
	                    value={filters.due}
	                    onChange={(event) => updateFilters({ due: event.target.value as DueFilter })}
	                  >
                    <option value="all">Alle data</option>
                    <option value="today">Vandaag</option>
                    <option value="overdue">Over tijd</option>
                    <option value="no_date">Geen datum</option>
                  </select>
                </label>
                <label>
                  <span>Hierarchie</span>
                  <select
                    value={filters.hierarchy}
                    onChange={(event) => updateFilters({ hierarchy: event.target.value as HierarchyFilter })}
                  >
                    <option value="all">Alles</option>
                    <option value="has_epic">Heeft epic</option>
                    <option value="no_epic">Loose tasks</option>
                    <option value="has_subtasks">Heeft subtasks</option>
                    <option value="blocked">Blocked</option>
                    <option value="ready_to_start">Ready to start</option>
                  </select>
                </label>
              </div>

              <div className="filter-toggles">
                <button className="ghost-button" onClick={() => applyQuickView('epic_planning')}>
                  Epic planning
                </button>
                <button className="ghost-button" onClick={() => applyQuickView('blocked')}>
                  Blocked
                </button>
                <button className="ghost-button" onClick={() => applyQuickView('my_next_tasks')}>
                  My next tasks
                </button>
                <button className="ghost-button" onClick={() => applyQuickView('loose_tasks')}>
                  Loose tasks
                </button>
                {activeView === 'list' ? (
                  <button
                    className={`ghost-button ${filters.onlyOpen ? 'active' : ''}`}
                    onClick={() => updateFilters({ onlyOpen: !filters.onlyOpen })}
                  >
                    Alleen open
                  </button>
                ) : null}
                <button
                  className={`ghost-button ${filters.onlyChecklistOpen ? 'active' : ''}`}
                  onClick={() => updateFilters({ onlyChecklistOpen: !filters.onlyChecklistOpen })}
                >
                  Checklist open
                </button>
              </div>

              <div className="filter-panel-actions">
                <button
                  className="ghost-button"
	                  onClick={() => {
	                    setFilters(EMPTY_FILTERS);
	                    applySortChange('manual');
	                  }}
	                >
                  Reset filters
                </button>
                <button className="ghost-button" onClick={() => setFiltersOpen(false)}>
                  Sluiten
                </button>
              </div>
            </div>
          ) : null}
        </header>

        <div
          className={`content-shell ${detailMode === 'overlay' ? 'content-shell-toggle' : 'content-shell-pinned'} ${
            detailOpen ? 'detail-open' : ''
          }`}
          style={detailMode === 'split' && detailOpen && !isFullscreenDetail ? { gridTemplateColumns: `minmax(0, 1fr) minmax(${DETAIL_PANE_MIN_WIDTH}px, ${detailPaneWidth}px)` } : undefined}
        >
          <section className={`main-pane ${activeView === 'list' ? 'main-pane-list' : ''}`}>
            {activeView === 'board' ? (
              <div className="board-canvas">
                {visibleColumns.map((column) => {
                  const destinationLength =
                    dragState
                      ? column.cards.filter((card) => card.id !== dragState.taskId).length
                      : column.cards.length;
                  return (
                  <section
                    className="board-column"
                    key={column.key}
                  >
                    <div className="column-header">
                      <span className={`status-accent-rail ${statusRailClass(column.key)}`} aria-hidden="true" />
                      <div className="column-heading">
                        <h2>{column.label}</h2>
                        <span className="column-count-chip">{column.count}</span>
                      </div>
                    </div>

                    <div className="column-cards">
                      {column.cards.map((card) => {
                        const isSelected = selectedTask?.id === card.id;
                        const agentLabel = activeAgentLabel(card);
                        const visibleTags = card.tags.slice(0, 2);
                        const hiddenTagCount = Math.max(card.tags.length - visibleTags.length, 0);
                        const hasMeta = Boolean(card.dueDate) || card.checklistProgress.total > 0;
                        const isDropBefore =
                          dropIndicator?.status === column.key &&
                          dropIndicator.cardId === card.id &&
                          dropIndicator.placement === 'before';
                        const isDropAfter =
                          dropIndicator?.status === column.key &&
                          dropIndicator.cardId === card.id &&
                          dropIndicator.placement === 'after';

                        return (
                          <div key={card.id} className="task-card-shell">
                            {isDropBefore ? <div className="drop-indicator drop-indicator-before" /> : null}
                            <article
                              className={`task-card ${isSelected ? 'selected' : ''}`}
                              draggable={dragEnabled}
                              onDragStart={() => handleTaskDragStart(card.id, card.status)}
                              onDragEnd={() => {
                                setDragState(null);
                                setDropIndicator(null);
                              }}
                              onDragOver={(event) => {
                                if (!dragEnabled || !dragState) {
                                  return;
                                }
                                event.preventDefault();
                                event.stopPropagation();
                                const nextIndicator = buildDropIndicatorForCard({
                                  event,
                                  dragState,
                                  status: column.key,
                                  cards: column.cards,
                                  cardId: card.id,
                                });
                                if (nextIndicator) {
                                  setDropIndicator(nextIndicator);
                                }
                              }}
                              onDrop={(event) => {
                                if (!dragEnabled || !dragState) {
                                  return;
                                }
                                event.preventDefault();
                                event.stopPropagation();
                                const nextIndicator = buildDropIndicatorForCard({
                                  event,
                                  dragState,
                                  status: column.key,
                                  cards: column.cards,
                                  cardId: card.id,
                                });
                                if (!nextIndicator) {
                                  return;
                                }
                                commitMove({
                                  targetStatus: column.key,
                                  anchorTaskId: nextIndicator.cardId,
                                  placement: nextIndicator.placement === 'before' ? 'before' : 'after',
                                });
                              }}
                              onClick={() => handleTaskSurfaceClick(card.id)}
                              onDoubleClick={() => vscode.postMessage({ type: 'openSourceFile', taskId: card.id })}
                            >
                              <div className="card-header">
                                <span className={`priority-badge ${card.priority}`}>{card.priority.toUpperCase()}</span>
                                <div className="card-header-badges">
                                  {isSelected ? <span className="active-task-chip">Geselecteerd</span> : null}
                                  {agentLabel ? <span className="agent-task-chip">{agentLabel}</span> : null}
                                  <span className="task-ref" title={card.id}>
                                    {formatTaskRef(card.id)}
                                  </span>
                                </div>
                              </div>

                              <h3>{card.title}</h3>
                              <div className="meta-row card-workstream-row">
                                <WorkstreamBadge workstream={card.workstream} />
                              </div>
                              <p className="card-summary">{card.excerpt}</p>

                              {(visibleTags.length > 0 || hiddenTagCount > 0) && (
                                <div className="meta-row card-tags">
                                  {visibleTags.map((tag) => (
                                    <span key={tag} className="tag-pill">
                                      {tag}
                                    </span>
                                  ))}
                                  {hiddenTagCount > 0 ? <span className="tag-pill muted-tag">+{hiddenTagCount}</span> : null}
                                </div>
                              )}

                              {hasMeta ? (
                                <div className="meta-row compact card-meta">
                                  {card.checklistProgress.total > 0 ? (
                                    <span className={`progress-pill ${checklistProgressTone(card.checklistProgress.completed, card.checklistProgress.total)}`}>
                                      {compactChecklistProgressLabel(card.checklistProgress.completed, card.checklistProgress.total)}
                                    </span>
                                  ) : null}
                                  <span>{formatLastChangeDate(card.updatedAt)}</span>
                                </div>
                              ) : null}
                            </article>
                            {isDropAfter ? <div className="drop-indicator drop-indicator-after" /> : null}
                          </div>
                        );
                      })}

                      {dropIndicator?.status === column.key &&
                      dropIndicator.cardId === null &&
                      dropIndicator.index === destinationLength ? (
                        <div className="drop-indicator drop-indicator-end" />
                      ) : null}

                      <div
                        className="column-drop-end-target"
                        onDragOver={(event) => {
                          if (!dragEnabled || !dragState) {
                            return;
                          }
                          event.preventDefault();
                          setDropIndicator({
                            status: column.key,
                            index: destinationLength,
                            cardId: null,
                            placement: 'between',
                          });
                        }}
                        onDrop={(event) => {
                          if (!dragEnabled || !dragState) {
                            return;
                          }
                          event.preventDefault();
                          event.stopPropagation();
                          commitMove({
                            targetStatus: column.key,
                            anchorTaskId: null,
                            placement: 'end',
                          });
                        }}
                      />

                      {column.cards.length === 0 ? <div className="empty-state">Geen kaarten in deze kolom.</div> : null}
                    </div>
                  </section>
                )})}
              </div>
            ) : null}

            {activeView === 'epics' ? (
              <div className="epics-shell">
                {visibleEpics.length > 0 ? (
                  visibleEpics.map((epic) => (
                    <EpicCard
                      key={epic.id}
                      epic={epic}
                      cardsById={cardMap}
                      onOpenTask={selectTask}
                    />
                  ))
                ) : (
                  <div className="state-shell">Geen epics gevonden voor de huidige zoek- of filterinstellingen.</div>
                )}
              </div>
            ) : null}

            {activeView === 'list' ? (
              <div className="list-shell">
	                <div className="list-table-shell">
	                  <table>
	                    <thead>
	                      <tr>
	                        <th>{renderSortHeader('title', 'Titel')}</th>
	                        <th>Domein</th>
	                        <th>{renderSortHeader('status', 'Status')}</th>
	                        <th>{renderSortHeader('priority', 'Priority')}</th>
	                        <th>{renderSortHeader('due', 'Last change')}</th>
	                        <th>{renderSortHeader('checklist', 'Checklist')}</th>
	                        <th>Volgorde</th>
	                      </tr>
	                    </thead>
	                    <tbody>
	                      {listCards.map((card) => {
	                        const isSelected = selectedTask?.id === card.id;
	                        const agentLabel = activeAgentLabel(card);
	                        return (
                        <tr
                          key={card.id}
                          className={
                            `${isSelected ? 'list-row-selected' : ''} ${
                              listDropIndicator?.targetTaskId === card.id
                                ? `list-row-drop-target ${
                                    listDropIndicator.placement === 'before'
                                      ? 'list-row-drop-target-before'
                                      : 'list-row-drop-target-after'
                                  }`
                                : ''
                            }`.trim()
                          }
                          aria-selected={isSelected}
                          draggable={listDragEnabled}
                          onDragStart={() => handleTaskDragStart(card.id, card.status)}
                          onDragEnd={() => {
                            setDragState(null);
                            setListDropIndicator(null);
                          }}
                          onDragOver={(event) => {
                            if (!listDragEnabled || !dragState || dragState.taskId === card.id) {
                              return;
                            }
                            event.preventDefault();
                            const placement = getDropPlacementForEvent(event);
                            setListDropIndicator({
                              targetTaskId: card.id,
                              placement,
                            });
                          }}
                          onDrop={(event) => {
                            if (!listDragEnabled || !dragState || dragState.taskId === card.id) {
                              return;
                            }
                            event.preventDefault();
                            event.stopPropagation();
                            const placement = getDropPlacementForEvent(event);
                            commitMove({
                              targetStatus: card.status,
                              anchorTaskId: card.id,
                              placement,
                            });
                          }}
                          onClick={() => handleTaskSurfaceClick(card.id)}
                        >
                          <td>
                            <div className="list-title-cell">
                              <span className={`status-accent-rail ${statusRailClass(card.status)}`} aria-hidden="true" />
                              <div className="list-title-copy">
                                <strong>
                                  {card.title}
                                  {agentLabel ? <span className="inline-agent-chip">{agentLabel}</span> : null}
                                </strong>
                                <span>{card.excerpt}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <WorkstreamBadge workstream={card.workstream} />
                          </td>
                          <td>
                            <span className={`list-status-text ${statusTextClass(card.status)}`}>
                              {STATUS_LABELS[card.status]}
                            </span>
                          </td>
                          <td>
                            <span className={`priority-badge ${card.priority}`}>{card.priority.toUpperCase()}</span>
                          </td>
                          <td>{formatLastChangeDate(card.updatedAt)}</td>
                          <td>
                            {card.checklistProgress.total > 0 ? (
                              <span className={`progress-pill ${checklistProgressTone(card.checklistProgress.completed, card.checklistProgress.total)}`}>
                                {compactChecklistProgressLabel(card.checklistProgress.completed, card.checklistProgress.total)}
                              </span>
                            ) : (
                              'Geen checklist'
                            )}
                          </td>
                          <td>
                            <div className="list-order-actions">
                              <button
                                type="button"
                                className="mini-icon-button"
                                title="Zet bovenaan in handmatige volgorde"
                                aria-label="Zet bovenaan in handmatige volgorde"
                                disabled={!listDragEnabled}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  moveTaskToListEdge(card.id, 'start');
                                }}
                              >
                                ⤒
                              </button>
                              <button
                                type="button"
                                className="mini-icon-button"
                                title="Zet onderaan in handmatige volgorde"
                                aria-label="Zet onderaan in handmatige volgorde"
                                disabled={!listDragEnabled}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  moveTaskToListEdge(card.id, 'end');
                                }}
                              >
                                ⤓
                              </button>
                            </div>
                          </td>
                        </tr>
	                        );
	                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {activeView === 'settings' ? (
              <div className="settings-shell">
                <section className="settings-card">
                  <h2>Board settings</h2>
                  <p>Pas alleen de compacte MVP-instellingen aan. De markdown files blijven leidend.</p>
                  <label className="toggle-row">
                    <span>Toon done-kolom</span>
                    <input
                      type="checkbox"
                      checked={snapshot.settings.showDoneColumn}
                      onChange={(event) =>
                        vscode.postMessage({
                          type: 'updateSetting',
                          key: 'showDoneColumn',
                          value: event.target.checked,
                        })
                      }
                    />
                  </label>
                  <label>
                    <span>Default sort</span>
                    <select
                      value={snapshot.settings.defaultSort}
                      onChange={(event) =>
                        vscode.postMessage({
                          type: 'updateSetting',
                          key: 'defaultSort',
                          value: event.target.value as TaskSort,
                        })
                      }
                    >
                      <option value="manual">Manual</option>
                      <option value="lane_order">Lane-volgorde</option>
                      <option value="status">Status</option>
                      <option value="due_date">Due date</option>
                      <option value="priority">Priority</option>
                      <option value="progress">Percentage</option>
                      <option value="updated_at">Recent gewijzigd</option>
                      <option value="alphabetical">Alfabetisch</option>
                    </select>
                  </label>
                  <div className="settings-readout">
                    <strong>Tasks root</strong>
                    <span>{snapshot.tasksRoot}</span>
                  </div>
                  <div className="settings-readout">
                    <strong>Kolommen</strong>
                    <span>{snapshot.settings.columns.map((status) => STATUS_LABELS[status]).join(', ')}</span>
                  </div>
                </section>
              </div>
            ) : null}
          </section>

          {detailOpen && detailMode === 'split' && !isFullscreenDetail ? (
            <button
              type="button"
              className={`detail-resize-handle ${isResizingDetailPane ? 'active' : ''}`}
              aria-label="Resize detail pane"
              onPointerDown={startResize}
            />
          ) : null}

          {detailOpen && detailMode === 'overlay' && !isFullscreenDetail ? (
            <button
              type="button"
              className={`detail-backdrop ${detailOpen ? 'visible' : ''}`}
              aria-label="Sluit details"
              onClick={requestClosePanel}
            />
          ) : null}

          {renderMode === 'split' ? renderDetailPane('split') : null}
        </div>

        {renderMode === 'fullscreen' ? (
          <div className="detail-fullscreen-layer">
            {renderDetailPane('fullscreen')}
          </div>
        ) : null}
      </main>
    </div>
  );

  function renderDetailPane(mode: Extract<DetailRenderMode, 'split' | 'fullscreen'>): React.JSX.Element {
    const detailSnapshot = snapshot;
    const detailAgentLabel = selectedTask ? activeAgentLabel(selectedTask) : null;
    return (
      <aside className={`detail-pane ${mode === 'fullscreen' ? 'detail-pane-fullscreen' : 'detail-pane-pinned'} open`}>
        {selectedTask && formState && detailSnapshot ? (
          <>
            <div className="detail-header">
                  <div className="detail-header-topbar">
                    <button
                      className="icon-button menu-toggle-button"
                      aria-label="Meer acties"
                      onClick={(event) => {
                        event.stopPropagation();
                        setDetailMenuOpen((open) => !open);
                      }}
                    >
                      ☰
                    </button>
                    <button
                      className="icon-button menu-toggle-button"
                      aria-label={detailFullscreen ? 'Verlaat fullscreen detail' : 'Open fullscreen detail'}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDetailFullscreen((value) => !value);
                      }}
                    >
                      {detailFullscreen ? '⤢' : '⤢'}
                    </button>
                    
                    <div className="detail-header-label">Task detail</div>
                    <button className="icon-button detail-close-icon" aria-label="Sluit details" onClick={requestClosePanel}>
                      ×
                    </button>
                  </div>
                  <div className="detail-hero">
                    <h2>{selectedTask.title}</h2>
                    <div className="detail-meta-chips">
                      <span className="active-task-chip">Geselecteerd</span>
                      {detailAgentLabel ? <span className="agent-task-chip agent-task-chip-pulsing">{detailAgentLabel}</span> : null}
                      <span className={`priority-badge ${selectedTask.priority}`}>{selectedTask.priority.toUpperCase()}</span>
                      <span className="task-ref" title={selectedTask.id}>
                        {formatTaskRef(selectedTask.id)}
                      </span>
                      <StatusBadge status={selectedTask.status} />
                      {selectedTask.dueDate ? <span className={dueClassName(selectedTask.dueDate)}>{selectedTask.dueDate}</span> : null}
                    </div>
                  </div>
                  {detailMenuOpen ? (
                    <div className="detail-menu" onClick={(event) => event.stopPropagation()}>
                      <button
                        className="ghost-button"
                        onClick={() => {
                          vscode.postMessage({ type: 'openSourceFile', taskId: selectedTask.id });
                          setDetailMenuOpen(false);
                        }}
                      >
                        Open source file
                      </button>
                      <button
                        className="ghost-button"
                        onClick={() => {
                          vscode.postMessage({ type: 'revealInExplorer', taskId: selectedTask.id });
                          setDetailMenuOpen(false);
                        }}
                      >
                        Reveal
                      </button>
                      <button
                        className="ghost-button"
                        onClick={() => {
                          vscode.postMessage({ type: 'copyRelativePath', taskId: selectedTask.id });
                          setDetailMenuOpen(false);
                        }}
                      >
                        Copy path
                      </button>
                      <button
                        className="ghost-button"
                        onClick={() => {
                          setArchiveConfirmOpen(true);
                          setDetailMenuOpen(false);
                        }}
                      >
                        Archiveer taak
                      </button>
                    </div>
                  ) : null}
                </div>

            <div className="detail-form">
                  <label className="detail-title-field">
                    <span>Titel</span>
                    <input ref={titleRef} value={formState.title} onChange={(event) => patchForm({ title: event.target.value })} />
                  </label>

                  <div className="form-grid">
                    <label>
                      <span>Status</span>
                      <select
                        value={formState.status}
                        onChange={(event) => patchForm({ status: event.target.value as TaskStatus })}
                      >
                        {detailSnapshot.settings.columns.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      <span>Priority</span>
                      <select
                        value={formState.priority}
                        onChange={(event) => patchForm({ priority: event.target.value as TaskPriority })}
                      >
                        <option value="p1">P1</option>
                        <option value="p2">P2</option>
                        <option value="p3">P3</option>
                      </select>
                    </label>
                    <label>
                      <span>Type</span>
                      <select
                        value={formState.taskKind}
                        onChange={(event) => patchForm({ taskKind: event.target.value as TaskKind })}
                      >
                        <option value="task">Task</option>
                        <option value="subtask">Subtask</option>
                        <option value="research">Research</option>
                        <option value="polish">Polish</option>
                      </select>
                    </label>
                  </div>

                  <label>
                    <span>Tags</span>
                    <input
                      value={formState.tags}
                      onChange={(event) => patchForm({ tags: event.target.value })}
                      placeholder="comma, separated, tags"
                    />
                  </label>

                  <label>
                    <span>Due date</span>
                    <input type="date" value={formState.dueDate} onChange={(event) => patchForm({ dueDate: event.target.value })} />
                  </label>

                  <label>
                    <span>Korte samenvatting</span>
                    <textarea rows={4} value={formState.summary} onChange={(event) => patchForm({ summary: event.target.value })} />
                  </label>

                  <div className="detail-section">
                    <strong>Bronbestand</strong>
                    <button
                      className="path-link-button"
                      onClick={() => vscode.postMessage({ type: 'openSourceFile', taskId: selectedTask.id })}
                    >
                      {selectedTask.relativePath}
                    </button>
                  </div>

                  <div className="detail-section">
                    <div className="detail-section-header">
                      <strong>Structuur</strong>
                      <div className="detail-section-actions">
                        <button
                          className="mini-button"
                          onClick={() => vscode.postMessage({ type: 'createSubtask', parentTaskId: selectedTask.id })}
                        >
                          Nieuwe subtask
                        </button>
                        <button
                          className="mini-button"
                          onClick={() =>
                            vscode.postMessage({
                              type: 'setEpicLink',
                              taskId: selectedTask.id,
                              expectedVersion: selectedTask.version,
                            })
                          }
                        >
                          Koppel epic
                        </button>
                        <button
                          className="mini-button"
                          onClick={() =>
                            vscode.postMessage({
                              type: 'addDependency',
                              taskId: selectedTask.id,
                              expectedVersion: selectedTask.version,
                            })
                          }
                        >
                          Dependency
                        </button>
                      </div>
                    </div>

                    <div className="detail-meta-grid">
                      <span className="muted-copy">Epic</span>
                      <span>{selectedTask.epicId ?? '—'}</span>
                      <span className="muted-copy">Parent task</span>
                      <span>{selectedTask.parentTaskId ?? '—'}</span>
                      <span className="muted-copy">Type</span>
                      <span>{selectedTask.taskKind}</span>
                      <span className="muted-copy">Blocked</span>
                      <span>{selectedTask.isBlocked ? 'Ja' : 'Nee'}</span>
                    </div>

                    <TaskRelationList
                      title="Subtasks"
                      ids={selectedTask.subtaskIds}
                      cardsById={cardMap}
                      onOpenTask={selectTask}
                      emptyLabel="Geen subtasks."
                    />
                    <TaskRelationList
                      title="Blocked by"
                      ids={selectedTask.blockedByIds}
                      cardsById={cardMap}
                      onOpenTask={selectTask}
                      emptyLabel="Geen blockers."
                    />
                    <TaskRelationList
                      title="Blocks"
                      ids={selectedTask.blockingIds}
                      cardsById={cardMap}
                      onOpenTask={selectTask}
                      emptyLabel="Blokkeert niets."
                    />
                    <TaskRelationList
                      title="Follows after"
                      ids={selectedTask.followsAfter}
                      cardsById={cardMap}
                      onOpenTask={selectTask}
                      emptyLabel="Geen vervolgvolgorde vastgelegd."
                    />
                  </div>

                  <div className="detail-section">
                    <strong>Alle tags</strong>
                    <div className="meta-row detail-tag-grid">
                      {selectedTask.tags.length > 0 ? (
                        selectedTask.tags.map((tag) => (
                          <span key={tag} className="tag-pill">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="muted-copy">Geen tags.</span>
                      )}
                    </div>
                  </div>

                  <div className="detail-section">
                    <strong>Agent metadata</strong>
                    <div className="detail-meta-grid">
                      <span className="muted-copy">Agent</span>
                      <span>{selectedTask.activeAgent ?? '—'}</span>
                      <span className="muted-copy">Model</span>
                      <span>{selectedTask.activeAgentModel ?? '—'}</span>
                      <span className="muted-copy">Runtime</span>
                      <span>{selectedTask.activeAgentRuntime ?? '—'}</span>
                      <span className="muted-copy">Sinds</span>
                      <span>{selectedTask.activeAgentSince ?? '—'}</span>
                      <span className="muted-copy">Status</span>
                      <span>{selectedTask.activeAgentStatus ?? '—'}</span>
                      <span className="muted-copy">Settings</span>
                      <span>{selectedTask.activeAgentSettings ?? '—'}</span>
                    </div>
                  </div>

                  <div className="checklist-block">
                    <h3>Checklist</h3>
                    {selectedTask.checklist.length > 0 ? (
                      selectedTask.checklist.map((item) => (
                        <label key={`${selectedTask.id}-${item.index}`} className="checklist-row">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={(event) =>
                              vscode.postMessage({
                                type: 'toggleChecklistItem',
                                taskId: selectedTask.id,
                                expectedVersion: selectedTask.version,
                                checklistIndex: item.index,
                                checked: event.target.checked,
                              })
                            }
                          />
                          <span className="checklist-label">{item.text}</span>
                        </label>
                      ))
                    ) : (
                      <p className="muted-copy">Geen checklist-items gevonden.</p>
                    )}
                  </div>

                  <div className="preview-block">
                    <h3>Body preview</h3>
                    <pre>{selectedTask.bodyPreview || 'Geen preview beschikbaar.'}</pre>
                  </div>

                  <button className="primary-button save-button" onClick={saveMetadata}>
                    Opslaan
                  </button>

                  {closeConfirmOpen ? (
                    <div className="close-confirm">
                      <strong>Wijzigingen opslaan?</strong>
                      <p className="muted-copy">Je hebt onopgeslagen wijzigingen in deze taak.</p>
                      <div className="close-confirm-actions">
                        <button
                          className="primary-button"
                          onClick={() => {
                            setPendingCloseAfterSave(true);
                            saveMetadata();
                          }}
                        >
                          Opslaan
                        </button>
                        <button
                          className="ghost-button"
                          onClick={() => {
                            setCloseConfirmOpen(false);
                            resetFormFromSelectedTask();
                            if (pendingSelectedTaskId) {
                              setSelectedTaskId(pendingSelectedTaskId);
                              setPendingSelectedTaskId(null);
                              setDetailOpen(true);
                            } else {
                              closeDetail();
                            }
                          }}
                        >
                          Verwerpen
                        </button>
                        <button className="ghost-button" onClick={() => setCloseConfirmOpen(false)}>
                          Annuleren
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="detail-danger-zone">
                    <button className="ghost-button" onClick={() => setArchiveConfirmOpen(true)}>
                      Archiveer
                    </button>
                    {archiveConfirmOpen ? (
                      <div className="close-confirm">
                        <strong>Taak archiveren?</strong>
                        <p className="muted-copy">
                          Deze taak wordt verplaatst naar archive en verdwijnt uit board en list.
                        </p>
                        <div className="close-confirm-actions">
                          <button
                            className="primary-button"
                            onClick={() => {
                              vscode.postMessage({
                                type: 'archiveTask',
                                taskId: selectedTask.id,
                                expectedVersion: selectedTask.version,
                              });
                              setArchiveConfirmOpen(false);
                              setDetailMenuOpen(false);
                            }}
                          >
                            Archiveer
                          </button>
                          <button className="ghost-button" onClick={() => setArchiveConfirmOpen(false)}>
                            Annuleren
                          </button>
                        </div>
                      </div>
                    ) : null}

                    <button className="ghost-button danger-secondary-button" onClick={() => setDeleteConfirmOpen(true)}>
                      Verwijderen
                    </button>
                    {deleteConfirmOpen ? (
                      <div className="close-confirm">
                        <strong>Taak verwijderen?</strong>
                        <p className="muted-copy">
                          Dit verwijdert het markdown-bestand en ruimt verwijzingen op binnen de task-map.
                        </p>
                        <div className="close-confirm-actions">
                          <button
                            className="primary-button danger-primary-button"
                            onClick={() => {
                              vscode.postMessage({
                                type: 'deleteTask',
                                taskId: selectedTask.id,
                                expectedVersion: selectedTask.version,
                              });
                              setDeleteConfirmOpen(false);
                              setDetailMenuOpen(false);
                            }}
                          >
                            Verwijderen
                          </button>
                          <button className="ghost-button" onClick={() => setDeleteConfirmOpen(false)}>
                            Annuleren
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
            </div>
          </>
        ) : (
          <div className="empty-detail">
            {mode === 'fullscreen' ? 'Open een kaart om details te bekijken.' : 'Selecteer een kaart om details te bekijken.'}
          </div>
        )}
      </aside>
    );
  }

  function switchView(view: ViewMode): void {
    setActiveView(view);
    vscode.postMessage({ type: 'switchView', view });
  }

  function updateFilters(patch: Partial<Filters>): void {
    setFilters((current) => ({
      ...current,
      ...patch,
    }));
  }

  function applySortChange(nextSort: TaskSort, nextDirection: SortDirection = 'asc'): void {
    setSort(nextSort);
    setSortDirection(nextDirection);
  }

  function applyQuickView(view: 'epic_planning' | 'blocked' | 'my_next_tasks' | 'loose_tasks'): void {
    if (view === 'epic_planning') {
      setActiveView('epics');
      setFilters({
        ...EMPTY_FILTERS,
        hierarchy: 'has_epic',
      });
      applySortChange('manual');
      return;
    }

    if (view === 'blocked') {
      setActiveView('list');
      setFilters({
        ...EMPTY_FILTERS,
        hierarchy: 'blocked',
        onlyOpen: true,
      });
      applySortChange('manual');
      return;
    }

    if (view === 'my_next_tasks') {
      setActiveView('list');
      setFilters({
        ...EMPTY_FILTERS,
        hierarchy: 'ready_to_start',
        onlyOpen: true,
      });
      applySortChange('manual');
      return;
    }

    setActiveView('list');
    setFilters({
      ...EMPTY_FILTERS,
      hierarchy: 'no_epic',
      onlyOpen: true,
    });
    applySortChange('manual');
  }

  function handleHeaderSort(column: ListSortColumn): void {
    const next = nextSortStateFromHeader({ sort, direction: sortDirection }, column);
    applySortChange(next.sort, next.direction);
  }

  function renderSortHeader(column: ListSortColumn, label: string): React.JSX.Element {
    const active = isColumnActive(sort, column);
    return (
      <button
        type="button"
        className={`list-sort-header ${active ? `active active-${sortDirection}` : ''}`}
        onClick={() => handleHeaderSort(column)}
        title={`Sorteer op ${label.toLowerCase()}`}
      >
        <span>{label}</span>
        {active ? <span className="list-sort-direction-icon">{directionArrow(sortDirection)}</span> : null}
      </button>
    );
  }

  function patchForm(patch: Partial<MetadataFormState>): void {
    setFormState((current) => (current ? { ...current, ...patch } : current));
  }

  function saveMetadata(): void {
    if (!selectedTask || !formState) {
      return;
    }

    vscode.postMessage({
      type: 'updateTaskFields',
      taskId: selectedTask.id,
      expectedVersion: selectedTask.version,
      patch: {
        title: formState.title.trim(),
        status: formState.status,
        priority: formState.priority,
        taskKind: formState.taskKind,
        summary: formState.summary.trim(),
        tags: splitTags(formState.tags),
        dueDate: formState.dueDate || null,
      },
    });
  }

  function commitMove(input: {
    targetStatus: TaskStatus;
    anchorTaskId: string | null;
    placement: DropPlacement;
  }): void {
    if (moveDispatchLockRef.current) {
      return;
    }
    if (!dragState || !snapshot) {
      return;
    }

    const sourceIdsInManualOrder = cardsForStatus(snapshot, dragState.sourceStatus).map((card) => card.id);
    const targetIdsInManualOrder = cardsForStatus(snapshot, input.targetStatus).map((card) => card.id);
    const task = snapshot.allCards.find((card) => card.id === dragState.taskId);
    if (!task) {
      return;
    }

    const movePlan = buildMovePlan({
      dragTaskId: dragState.taskId,
      sourceStatus: dragState.sourceStatus,
      targetStatus: input.targetStatus,
      sourceIdsInManualOrder,
      targetIdsInManualOrder,
      anchorTaskId: input.anchorTaskId,
      placement: input.placement,
    });

    moveDispatchLockRef.current = true;
    window.setTimeout(() => {
      moveDispatchLockRef.current = false;
    }, 0);

    vscode.postMessage({
      type: 'moveTask',
      taskId: dragState.taskId,
      expectedVersion: task.version,
      targetStatus: input.targetStatus,
      destinationIds: movePlan.destinationIds,
      sourceIds: movePlan.sourceIds,
    });
    setDragState(null);
    setDropIndicator(null);
    setListDropIndicator(null);
  }

  function handleTaskDragStart(taskId: string, sourceStatus: TaskStatus): void {
    suppressSelectionUntilRef.current = Date.now() + CLICK_DRAG_SUPPRESSION_MS;
    setDragState({ taskId, sourceStatus });
  }

  function handleTaskSurfaceClick(taskId: string): void {
    if (Date.now() < suppressSelectionUntilRef.current) {
      return;
    }

    selectTask(taskId);
  }

  function selectTask(taskId: string): void {
    if (selectedTaskId === taskId) {
      return;
    }

    if (formDirty) {
      setPendingSelectedTaskId(taskId);
      setCloseConfirmOpen(true);
      return;
    }

    setSelectedTaskId(taskId);
    setDetailOpen(true);
    setCloseConfirmOpen(false);
    setPendingCloseAfterSave(false);
    setPendingSelectedTaskId(null);
  }

  function resetFormFromSelectedTask(): void {
    if (!selectedTask) {
      return;
    }

    setFormState(toMetadataFormState(selectedTask));
    setFormTaskId(selectedTask.id);
    setPendingDiskChanges(false);
  }

  function requestClosePanel(): void {
    setDetailMenuOpen(false);
    if (formDirty) {
      setPendingSelectedTaskId(null);
      setCloseConfirmOpen(true);
      return;
    }
    setCloseConfirmOpen(false);
    closeDetail();
  }

  function handleRefresh(): void {
    if (refreshState === 'loading') {
      return;
    }
    setRefreshState('loading');
    vscode.postMessage({ type: 'refreshBoard' });
  }

  function moveTaskToListEdge(taskId: string, edge: 'start' | 'end'): void {
    if (!snapshot || !listDragEnabled) {
      return;
    }

    const task = snapshot.allCards.find((entry) => entry.id === taskId);
    if (!task) {
      return;
    }

    const orderedInStatus = cardsForStatus(snapshot, task.status).map((entry) => entry.id);
    const withoutTask = orderedInStatus.filter((id) => id !== taskId);
    const destinationIds = edge === 'start' ? [taskId, ...withoutTask] : [...withoutTask, taskId];

    vscode.postMessage({
      type: 'moveTask',
      taskId,
      expectedVersion: task.version,
      targetStatus: task.status,
      destinationIds,
      sourceIds: withoutTask,
    });
    setListDropIndicator(null);
    setDropIndicator(null);
    setDragState(null);
  }
}

function refreshButtonTitle(state: 'idle' | 'loading' | 'success' | 'error'): string {
  if (state === 'loading') {
    return 'Verversen...';
  }
  if (state === 'success') {
    return 'Verversd';
  }
  if (state === 'error') {
    return 'Verversen mislukt';
  }
  return 'Refresh';
}

function isFormDirty(task: TaskCardViewModel | null, formState: MetadataFormState | null): boolean {
  if (!task || !formState) {
    return false;
  }

  if (formState.title.trim() !== task.title) {
    return true;
  }
  if (formState.status !== task.status) {
    return true;
  }
  if (formState.priority !== task.priority) {
    return true;
  }
  if (formState.taskKind !== task.taskKind) {
    return true;
  }
  if (formState.summary.trim() !== task.summary) {
    return true;
  }
  if (formState.dueDate !== (task.dueDate ?? '')) {
    return true;
  }

  return splitTags(formState.tags).join(',') !== task.tags.join(',');
}

function IconButton(props: { active: boolean; label: string; icon: string; onClick: () => void }): React.JSX.Element {
  return (
    <button className={`rail-button rail-icon-button ${props.active ? 'active' : ''}`} onClick={props.onClick} title={props.label} aria-label={props.label}>
      <span className="rail-button-icon" aria-hidden="true">{props.icon}</span>
    </button>
  );
}

function EpicCard(props: {
  epic: EpicViewModel;
  cardsById: Map<string, TaskCardViewModel>;
  onOpenTask: (taskId: string) => void;
}): React.JSX.Element {
  const cards = props.epic.linkedTaskIds
    .map((taskId) => props.cardsById.get(taskId))
    .filter((card): card is TaskCardViewModel => Boolean(card));

  return (
    <article className="epic-card">
      <div className="epic-card-header">
        <div className="epic-card-copy">
          <div className="eyebrow">Epic</div>
          <h2>{props.epic.title}</h2>
          <p className="muted-copy">{props.epic.summary || 'Geen samenvatting.'}</p>
        </div>
        <div className="epic-card-badges">
          <span className={`priority-badge ${props.epic.priority}`}>{props.epic.priority.toUpperCase()}</span>
          <StatusBadge status={props.epic.status} />
        </div>
      </div>

      <div className="epic-stats">
        <StatusChip>{props.epic.openTaskCount} open</StatusChip>
        <StatusChip>{props.epic.doneTaskCount} done</StatusChip>
        <StatusChip>{props.epic.blockedTaskIds.length} blocked</StatusChip>
        <StatusChip>{props.epic.subtaskIds.length} subtasks</StatusChip>
      </div>

      <div className="relationship-list">
        {cards.length > 0 ? (
          cards.map((card) => (
            <button key={card.id} className="relationship-item" onClick={() => props.onOpenTask(card.id)}>
              <span className="relationship-main">
                <span className="relationship-title">{card.title}</span>
                <span className="relationship-meta">
                  {STATUS_LABELS[card.status]} · {card.taskKind}
                </span>
              </span>
              {card.isBlocked ? <span className="relationship-badge">Blocked</span> : null}
            </button>
          ))
        ) : (
          <p className="muted-copy">Geen linked tasks.</p>
        )}
      </div>
    </article>
  );
}

function TaskRelationList(props: {
  title: string;
  ids: string[];
  cardsById: Map<string, TaskCardViewModel>;
  onOpenTask: (taskId: string) => void;
  emptyLabel: string;
}): React.JSX.Element {
  const cards = props.ids
    .map((taskId) => props.cardsById.get(taskId))
    .filter((card): card is TaskCardViewModel => Boolean(card));

  return (
    <div className="relationship-block">
      <span className="muted-copy">{props.title}</span>
      {cards.length > 0 ? (
        <div className="relationship-list">
          {cards.map((card) => (
            <button key={card.id} className="relationship-item" onClick={() => props.onOpenTask(card.id)}>
              <span className="relationship-main">
                <span className="relationship-title">{card.title}</span>
                <span className="relationship-meta">
                  {STATUS_LABELS[card.status]} · {card.taskKind}
                </span>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <span className="muted-copy">{props.emptyLabel}</span>
      )}
    </div>
  );
}

function StatusChip(props: { children: React.ReactNode; danger?: boolean }): React.JSX.Element {
  return <span className={props.danger ? 'status-chip status-chip-danger' : 'status-chip'}>{props.children}</span>;
}

function StatusBadge(props: { status: TaskStatus }): React.JSX.Element {
  return <span className={`status-badge ${statusBadgeClass(props.status)}`}>{STATUS_LABELS[props.status]}</span>;
}

function WorkstreamBadge(props: { workstream: TaskWorkstream | null }): React.JSX.Element {
  if (!props.workstream) {
    return <span className="workstream-badge workstream-unknown">Overig</span>;
  }
  return (
    <span className={`workstream-badge workstream-${props.workstream}`}>
      {WORKSTREAM_LABELS[props.workstream]}
    </span>
  );
}

function hasActiveFiltering(search: string, filters: Filters, activeView: ViewMode): boolean {
  return Boolean(search.trim()) || Object.entries(filters).some(([key, value]) => {
    if (key === 'onlyOpen') {
      return activeView === 'list' ? Boolean(value) : false;
    }
    if (key === 'onlyChecklistOpen') {
      return Boolean(value);
    }
    return value !== 'all';
  });
}

function getEffectiveFilters(filters: Filters, activeView: ViewMode): Filters {
  if (activeView === 'list') {
    return filters;
  }

  return {
    ...filters,
    onlyOpen: false,
  };
}

function matchesFilters(card: TaskCardViewModel, search: string, filters: Filters): boolean {
  const query = search.trim().toLowerCase();
  if (query) {
    const haystack = [card.title, card.summary, card.bodyPreview, card.relativePath, card.tags.join(' ')]
      .join(' ')
      .toLowerCase();
    if (!haystack.includes(query)) {
      return false;
    }
  }

  if (filters.status !== 'all' && card.status !== filters.status) {
    return false;
  }
  if (filters.priority !== 'all' && card.priority !== filters.priority) {
    return false;
  }
  if (filters.tag !== 'all' && !card.tags.includes(filters.tag)) {
    return false;
  }
  if (filters.workstream !== 'all' && card.workstream !== filters.workstream) {
    return false;
  }
  if (filters.onlyOpen && card.status === 'done') {
    return false;
  }
  if (filters.onlyChecklistOpen && card.checklistProgress.open === 0) {
    return false;
  }
  if (!matchesDueFilter(card.dueDate, filters.due)) {
    return false;
  }
  if (!matchesHierarchyFilter(card, filters.hierarchy)) {
    return false;
  }

  return true;
}

function matchesEpicSearch(epic: EpicViewModel, search: string): boolean {
  const query = search.trim().toLowerCase();
  if (!query) {
    return true;
  }

  return [epic.title, epic.summary, epic.id, epic.relativePath].join(' ').toLowerCase().includes(query);
}

function matchesHierarchyFilter(card: TaskCardViewModel, filter: HierarchyFilter): boolean {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'has_epic') {
    return Boolean(card.epicId);
  }
  if (filter === 'no_epic') {
    return !card.epicId;
  }
  if (filter === 'has_subtasks') {
    return card.subtaskIds.length > 0;
  }
  if (filter === 'blocked') {
    return card.isBlocked;
  }
  return card.isReadyToStart;
}

function matchesDueFilter(dueDate: string | null, filter: DueFilter): boolean {
  if (filter === 'all') {
    return true;
  }

  if (filter === 'no_date') {
    return !dueDate;
  }

  if (!dueDate) {
    return false;
  }

  const today = new Date().toISOString().slice(0, 10);
  if (filter === 'today') {
    return dueDate === today;
  }

  return dueDate < today;
}

function cardsForStatus(snapshot: BoardSnapshot, status: TaskStatus): TaskCardViewModel[] {
  return sortTaskCards(
    snapshot.allCards.filter((card) => card.status === status),
    'manual',
  );
}

function buildDropIndicatorForCard(input: {
  event: React.DragEvent<HTMLElement>;
  dragState: DragState;
  status: TaskStatus;
  cards: TaskCardViewModel[];
  cardId: string;
}): DropIndicatorState | null {
  const destinationWithoutTask = input.cards
    .filter((card) => card.id !== input.dragState.taskId)
    .map((card) => card.id);
  if (!destinationWithoutTask.includes(input.cardId)) {
    return null;
  }

  const rect = input.event.currentTarget.getBoundingClientRect();
  const placement = getDropPlacementFromPointer(input.event.clientY - rect.top, rect.height);
  const index = computeInsertIndex({
    destinationIdsWithoutDragged: destinationWithoutTask,
    anchorTaskId: input.cardId,
    placement,
  });

  return {
    status: input.status,
    index,
    cardId: input.cardId,
    placement,
  };
}

function splitTags(input: string): string[] {
  return input
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function dueClassName(dueDate: string): string {
  const today = new Date().toISOString().slice(0, 10);
  if (dueDate < today) {
    return 'due-badge overdue';
  }
  if (dueDate === today) {
    return 'due-badge today';
  }
  return 'due-badge';
}

function dueLabel(dueDate: string): string {
  const today = new Date().toISOString().slice(0, 10);
  if (dueDate === today) {
    return 'Vandaag';
  }
  if (dueDate < today) {
    return 'Over tijd';
  }
  return dueDate;
}

function getDropPlacementForEvent(event: React.DragEvent<HTMLElement>): 'before' | 'after' {
  const rect = event.currentTarget.getBoundingClientRect();
  return getDropPlacementFromPointer(event.clientY - rect.top, rect.height);
}

const STATUS_TEXT_CLASS: Record<TaskStatus, string> = {
  backlog: 'status-text-backlog',
  ready: 'status-text-ready',
  in_progress: 'status-text-in-progress',
  review: 'status-text-review',
  blocked: 'status-text-blocked',
  done: 'status-text-done',
};

const STATUS_BADGE_CLASS: Record<TaskStatus, string> = {
  backlog: 'status-badge-tone-backlog',
  ready: 'status-badge-tone-ready',
  in_progress: 'status-badge-tone-in-progress',
  review: 'status-badge-tone-review',
  blocked: 'status-badge-tone-blocked',
  done: 'status-badge-tone-done',
};

const STATUS_RAIL_CLASS: Record<TaskStatus, string> = {
  backlog: 'status-rail-backlog',
  ready: 'status-rail-ready',
  in_progress: 'status-rail-in-progress',
  review: 'status-rail-review',
  blocked: 'status-rail-blocked',
  done: 'status-rail-done',
};

function statusTextClass(status: TaskStatus): string {
  return STATUS_TEXT_CLASS[status];
}

function statusBadgeClass(status: TaskStatus): string {
  return STATUS_BADGE_CLASS[status];
}

function statusRailClass(status: TaskStatus): string {
  return STATUS_RAIL_CLASS[status];
}

function formatTaskRef(taskId: string): string {
  const base = taskId.replace(/^task-/, '');
  if (!base) {
    return 'TASK';
  }

  if (base.length <= 16) {
    return base.toUpperCase();
  }

  return `${base.slice(0, 16).toUpperCase()}…`;
}

function toMetadataFormState(task: TaskCardViewModel): MetadataFormState {
  return {
    title: task.title,
    status: task.status,
    priority: task.priority,
    taskKind: task.taskKind,
    summary: task.summary,
    tags: task.tags.join(', '),
    dueDate: task.dueDate ?? '',
  };
}
