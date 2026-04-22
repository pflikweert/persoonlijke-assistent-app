import React, { useEffect, useMemo, useRef, useState } from 'react';
import { STATUS_LABELS } from '../../src/tasks/constants';
import type {
  BoardSnapshot,
  TaskCardViewModel,
  TaskPriority,
  TaskSort,
  TaskStatus,
} from '../../src/tasks/types';
import type { HostToWebviewMessage } from '../../src/webview-bridge/messages';
import { vscode } from './vscode';

type ViewMode = 'board' | 'list' | 'settings';
type DueFilter = 'all' | 'today' | 'overdue' | 'no_date';
type ViewportKind = 'desktop' | 'tablet' | 'small';

interface Filters {
  status: 'all' | TaskStatus;
  priority: 'all' | TaskPriority;
  tag: 'all' | string;
  due: DueFilter;
  onlyOpen: boolean;
  onlyChecklistOpen: boolean;
}

interface DragState {
  taskId: string;
  sourceStatus: TaskStatus;
}

interface MetadataFormState {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  summary: string;
  tags: string;
  dueDate: string;
}

const EMPTY_FILTERS: Filters = {
  status: 'all',
  priority: 'all',
  tag: 'all',
  due: 'all',
  onlyOpen: false,
  onlyChecklistOpen: false,
};

const REFRESH_SUCCESS_MS = 1200;
const STATUS_TONE_CLASS: Record<TaskStatus, string> = {
  backlog: 'status-tone-backlog',
  ready: 'status-tone-ready',
  in_progress: 'status-tone-in-progress',
  blocked: 'status-tone-blocked',
  done: 'status-tone-done',
};

export function App(): React.JSX.Element {
  const [snapshot, setSnapshot] = useState<BoardSnapshot | null>(null);
  const [activeView, setActiveView] = useState<ViewMode>('board');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [sort, setSort] = useState<TaskSort>('manual');
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{ status: TaskStatus; index: number } | null>(null);
  const [formState, setFormState] = useState<MetadataFormState | null>(null);
  const [viewport, setViewport] = useState<ViewportKind>(getViewportKind);
  const [detailOpen, setDetailOpen] = useState<boolean>(getViewportKind() === 'desktop');
  const [detailMenuOpen, setDetailMenuOpen] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);
  const [pendingCloseAfterSave, setPendingCloseAfterSave] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [refreshState, setRefreshState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const searchRef = useRef<HTMLInputElement | null>(null);
  const titleRef = useRef<HTMLInputElement | null>(null);
  const refreshResetTimeoutRef = useRef<number | null>(null);

  const detailMode = viewport === 'desktop' ? 'split' : 'overlay';

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
      setDetailMenuOpen(false);
      setCloseConfirmOpen(false);
      setPendingCloseAfterSave(false);
      setDeleteConfirmOpen(false);
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
        setSort((current) => current ?? message.snapshot.sort);
        if (message.view) {
          setActiveView(message.view);
        }
        const requestedTaskId = message.focusTaskId ?? selectedTaskId;
        const requestedTaskStillExists = requestedTaskId
          ? message.snapshot.allCards.some((card) => card.id === requestedTaskId)
          : false;
        if (requestedTaskStillExists && requestedTaskId) {
          setSelectedTaskId(requestedTaskId);
          if (message.focusTaskId && getViewportKind() !== 'desktop') {
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
  }, [pendingCloseAfterSave, selectedTaskId]);

  const tags = useMemo(() => {
    const values = new Set<string>();
    snapshot?.allCards.forEach((card) => {
      card.tags.forEach((tag) => values.add(tag));
    });
    return [...values].sort((left, right) => left.localeCompare(right));
  }, [snapshot]);

  const filteredCards = useMemo(() => {
    if (!snapshot) {
      return [];
    }

    return sortCards(
      snapshot.allCards.filter((card) => matchesFilters(card, search, filters)),
      sort,
    );
  }, [filters, search, snapshot, sort]);

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
      return;
    }

    setFormState({
      title: selectedTask.title,
      status: selectedTask.status,
      priority: selectedTask.priority,
      summary: selectedTask.summary,
      tags: selectedTask.tags.join(', '),
      dueDate: selectedTask.dueDate ?? '',
    });
  }, [selectedTask?.id, selectedTask?.version.hash, selectedTask?.version.mtimeMs]);

  useEffect(() => {
    setDetailMenuOpen(false);
    setCloseConfirmOpen(false);
    setPendingCloseAfterSave(false);
    setDeleteConfirmOpen(false);
  }, [selectedTask?.id]);

  useEffect(() => {
    if (!detailMenuOpen) {
      return;
    }

    const onGlobalClick = () => setDetailMenuOpen(false);
    window.addEventListener('click', onGlobalClick);
    return () => window.removeEventListener('click', onGlobalClick);
  }, [detailMenuOpen]);

  const dragEnabled = !hasActiveFiltering(search, filters) && sort === 'manual';
  const hasActiveFilters = hasActiveFiltering('', filters) || sort !== 'manual';
  const formDirty = isFormDirty(selectedTask, formState);

  if (!snapshot) {
    return <div className="state-shell">Taken laden...</div>;
  }

  return (
    <div className={`app-shell viewport-${viewport} detail-${detailMode}`}>
      <aside className="icon-rail">
        <IconButton active={activeView === 'board'} label="Board" onClick={() => switchView('board')} />
        <IconButton active={activeView === 'list'} label="List" onClick={() => switchView('list')} />
        <IconButton active={activeView === 'settings'} label="Settings" onClick={() => switchView('settings')} />
        <button
          className={`rail-button refresh-button ${refreshState}`}
          onClick={handleRefresh}
          title="Refresh"
          disabled={refreshState === 'loading'}
        >
          {refreshState === 'loading' ? 'Refreshing…' : 'Refresh'}
        </button>
      </aside>

      <main className="workspace-shell">
        <header className="topbar">
          <div className="topbar-main">
            <div className="topbar-title-wrap">
              <div className="topbar-title">Board</div>
              <div className="eyebrow">Budio Workspace</div>
            </div>

            <div className="topbar-main-actions">
              <button
                className="primary-button"
                onClick={() => vscode.postMessage({ type: 'createTask', status: 'ready' })}
              >
                Nieuwe taak
              </button>
              <button className={`ghost-button ${filtersOpen ? 'active' : ''}`} onClick={() => setFiltersOpen((open) => !open)}>
                Filter {hasActiveFilters ? '•' : ''}
              </button>
              <button
                className={`ghost-button refresh-button ${refreshState}`}
                onClick={handleRefresh}
                disabled={refreshState === 'loading'}
              >
                {refreshState === 'loading'
                  ? 'Verversen...'
                  : refreshState === 'success'
                    ? 'Verversd'
                    : 'Refresh'}
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
              <StatusChip>{snapshot.totalTasks} taken</StatusChip>
              <StatusChip>{snapshot.openTaskCount} open</StatusChip>
              <StatusChip>{snapshot.doneTaskCount} done</StatusChip>
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
                  <span>Sortering</span>
                  <select value={sort} onChange={(event) => setSort(event.target.value as TaskSort)}>
                    <option value="manual">Manual</option>
                    <option value="due_date">Due date</option>
                    <option value="priority">Priority</option>
                    <option value="updated_at">Recent gewijzigd</option>
                    <option value="alphabetical">Alfabetisch</option>
                  </select>
                </label>
              </div>

              <div className="filter-toggles">
                <button
                  className={`ghost-button ${filters.onlyOpen ? 'active' : ''}`}
                  onClick={() => updateFilters({ onlyOpen: !filters.onlyOpen })}
                >
                  Alleen open
                </button>
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
                    setSort('manual');
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

        <section className="status-strip">
          {!dragEnabled ? <StatusChip>Drag/drop alleen in manual zonder filters</StatusChip> : null}
          {selectedTask ? (
            <button
              className="ghost-button detail-toggle-button"
              onClick={() => {
                if (detailOpen) {
                  requestClosePanel();
                } else {
                  setDetailOpen(true);
                }
              }}
            >
              {detailOpen ? 'Sluit details' : 'Open details'}
            </button>
          ) : null}
          {savingTaskId ? <StatusChip>Opslaan...</StatusChip> : null}
          {notice ? <StatusChip>{notice}</StatusChip> : null}
          {error ? <StatusChip danger>{error}</StatusChip> : null}
        </section>

        <div
          className={`content-shell ${detailMode === 'overlay' ? 'content-shell-toggle' : 'content-shell-pinned'} ${
            detailOpen ? 'detail-open' : ''
          }`}
        >
          <section className="main-pane">
            {activeView === 'board' ? (
              <div className="board-canvas">
                {visibleColumns.map((column) => (
                  <section
                    className="board-column"
                    key={column.key}
                    onDragOver={(event) => {
                      if (!dragEnabled || !dragState) {
                        return;
                      }
                      event.preventDefault();
                      setDropIndicator({ status: column.key, index: column.cards.length });
                    }}
                    onDrop={(event) => {
                      if (!dragEnabled || !dragState) {
                        return;
                      }
                      event.preventDefault();
                      commitMove(column.key, column.cards.length);
                    }}
                  >
                    <div className="column-header">
                      <span className={`status-accent-rail ${statusToneClass(column.key)}`} aria-hidden="true" />
                      <div className="column-heading">
                        <h2>{column.label}</h2>
                        <span>{column.count}</span>
                      </div>
                    </div>

                    <div className="column-cards">
                      {column.cards.map((card, index) => {
                        const visibleTags = card.tags.slice(0, 2);
                        const hiddenTagCount = Math.max(card.tags.length - visibleTags.length, 0);
                        const hasMeta = Boolean(card.dueDate) || card.checklistProgress.total > 0;

                        return (
                          <div key={card.id}>
                            {dropIndicator?.status === column.key && dropIndicator.index === index ? (
                              <div className="drop-indicator" />
                            ) : null}
                            <article
                              className={`task-card ${selectedTask?.id === card.id ? 'selected' : ''}`}
                              draggable={dragEnabled}
                              onDragStart={() => setDragState({ taskId: card.id, sourceStatus: card.status })}
                              onDragEnd={() => {
                                setDragState(null);
                                setDropIndicator(null);
                              }}
                              onDragOver={(event) => {
                                if (!dragEnabled || !dragState) {
                                  return;
                                }
                                event.preventDefault();
                                setDropIndicator({ status: column.key, index });
                              }}
                              onDrop={(event) => {
                                if (!dragEnabled || !dragState) {
                                  return;
                                }
                                event.preventDefault();
                                commitMove(column.key, index);
                              }}
                              onClick={() => selectTask(card.id)}
                              onDoubleClick={() => vscode.postMessage({ type: 'openSourceFile', taskId: card.id })}
                            >
                              <div className="card-header">
                                <span className={`priority-badge ${card.priority}`}>{card.priority.toUpperCase()}</span>
                                <span className="task-ref" title={card.id}>
                                  {formatTaskRef(card.id)}
                                </span>
                              </div>

                              <h3>{card.title}</h3>
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
                                    <span>{checklistProgressLabel(card.checklistProgress.completed, card.checklistProgress.total)}</span>
                                  ) : null}
                                  {card.dueDate ? <span>{dueLabel(card.dueDate)}</span> : null}
                                </div>
                              ) : null}
                            </article>
                          </div>
                        );
                      })}

                      {dropIndicator?.status === column.key && dropIndicator.index === column.cards.length ? (
                        <div className="drop-indicator" />
                      ) : null}

                      {column.cards.length === 0 ? <div className="empty-state">Geen kaarten in deze kolom.</div> : null}
                    </div>
                  </section>
                ))}
              </div>
            ) : null}

            {activeView === 'list' ? (
              <div className="list-shell">
                <div className="list-table-shell">
                  <table>
                    <thead>
                      <tr>
                        <th>Titel</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Due</th>
                        <th>Checklist</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCards.map((card) => (
                        <tr key={card.id} onClick={() => selectTask(card.id)}>
                          <td>
                            <div className="list-title-cell">
                              <span className={`status-accent-rail ${statusToneClass(card.status)}`} aria-hidden="true" />
                              <strong>{card.title}</strong>
                              <span>{card.excerpt}</span>
                            </div>
                          </td>
                          <td>
                            <StatusBadge status={card.status} />
                          </td>
                          <td>
                            <span className={`priority-badge ${card.priority}`}>{card.priority.toUpperCase()}</span>
                          </td>
                          <td>{card.dueDate ?? '—'}</td>
                          <td>{checklistProgressLabel(card.checklistProgress.completed, card.checklistProgress.total)}</td>
                        </tr>
                      ))}
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
                      <option value="due_date">Due date</option>
                      <option value="priority">Priority</option>
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

          {detailOpen ? (
            <button
              type="button"
              className={`detail-backdrop ${detailOpen ? 'visible' : ''}`}
              aria-label="Sluit details"
              onClick={requestClosePanel}
            />
          ) : null}

          {detailOpen ? (
            <aside
              className={`detail-pane ${detailMode === 'overlay' ? 'detail-pane-toggle' : 'detail-pane-pinned'} ${
                detailOpen ? 'open' : ''
              }`}
            >
            {selectedTask && formState ? (
              <>
                <div className="detail-header">
                  <div className="detail-header-top">
                    <div className="detail-title-row">
                      <button
                        className="ghost-button menu-toggle-button"
                        aria-label="Meer acties"
                        onClick={(event) => {
                          event.stopPropagation();
                          setDetailMenuOpen((open) => !open);
                        }}
                      >
                        ☰
                      </button>
                      <div className="detail-copy">
                        <div className="eyebrow">Task detail</div>
                        <h2>{selectedTask.title}</h2>
                        <div className="detail-meta-chips">
                          <span className={`priority-badge ${selectedTask.priority}`}>{selectedTask.priority.toUpperCase()}</span>
                          <span className="task-ref" title={selectedTask.id}>
                            {formatTaskRef(selectedTask.id)}
                          </span>
                          <StatusBadge status={selectedTask.status} />
                          {selectedTask.dueDate ? <span className={dueClassName(selectedTask.dueDate)}>{selectedTask.dueDate}</span> : null}
                        </div>
                      </div>
                    </div>
                    <button className="icon-button detail-close-icon" aria-label="Sluit details" onClick={requestClosePanel}>
                      ×
                    </button>
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
                    </div>
                  ) : null}
                </div>

                <div className="detail-form">
                  <label>
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
                        {snapshot.settings.columns.map((status) => (
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
                            setDetailOpen(false);
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
                {detailMode === 'overlay'
                  ? 'Open een kaart om details te bekijken.'
                  : 'Selecteer een kaart om details te bekijken.'}
              </div>
            )}
            </aside>
          ) : null}
        </div>
      </main>
    </div>
  );

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
        summary: formState.summary.trim(),
        tags: splitTags(formState.tags),
        dueDate: formState.dueDate || null,
      },
    });
  }

  function commitMove(targetStatus: TaskStatus, targetIndex: number): void {
    if (!dragState || !snapshot) {
      return;
    }

    const sourceColumn = snapshot.columns.find((column) => column.key === dragState.sourceStatus);
    const targetColumn = snapshot.columns.find((column) => column.key === targetStatus);
    const task = snapshot.allCards.find((card) => card.id === dragState.taskId);
    if (!sourceColumn || !targetColumn || !task) {
      return;
    }

    const withoutSource = sourceColumn.cards.filter((card) => card.id !== dragState.taskId).map((card) => card.id);
    const destinationWithoutTask = targetColumn.cards
      .filter((card) => card.id !== dragState.taskId)
      .map((card) => card.id);
    const destinationIds = [...destinationWithoutTask];
    destinationIds.splice(targetIndex, 0, dragState.taskId);

    vscode.postMessage({
      type: 'moveTask',
      taskId: dragState.taskId,
      expectedVersion: task.version,
      targetStatus,
      destinationIds,
      sourceIds: dragState.sourceStatus === targetStatus ? [] : withoutSource,
    });
    setDragState(null);
    setDropIndicator(null);
  }

  function selectTask(taskId: string): void {
    setSelectedTaskId(taskId);
    setDetailOpen(true);
    setCloseConfirmOpen(false);
    setPendingCloseAfterSave(false);
  }

  function resetFormFromSelectedTask(): void {
    if (!selectedTask) {
      return;
    }

    setFormState({
      title: selectedTask.title,
      status: selectedTask.status,
      priority: selectedTask.priority,
      summary: selectedTask.summary,
      tags: selectedTask.tags.join(', '),
      dueDate: selectedTask.dueDate ?? '',
    });
  }

  function requestClosePanel(): void {
    setDetailMenuOpen(false);
    if (formDirty) {
      setCloseConfirmOpen(true);
      return;
    }
    setCloseConfirmOpen(false);
    setDetailOpen(false);
  }

  function handleRefresh(): void {
    if (refreshState === 'loading') {
      return;
    }
    setRefreshState('loading');
    vscode.postMessage({ type: 'refreshBoard' });
  }
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
  if (formState.summary.trim() !== task.summary) {
    return true;
  }
  if (formState.dueDate !== (task.dueDate ?? '')) {
    return true;
  }

  return splitTags(formState.tags).join(',') !== task.tags.join(',');
}

function IconButton(props: { active: boolean; label: string; onClick: () => void }): React.JSX.Element {
  return (
    <button className={`rail-button ${props.active ? 'active' : ''}`} onClick={props.onClick} title={props.label}>
      {props.label}
    </button>
  );
}

function StatusChip(props: { children: React.ReactNode; danger?: boolean }): React.JSX.Element {
  return <span className={props.danger ? 'status-chip status-chip-danger' : 'status-chip'}>{props.children}</span>;
}

function StatusBadge(props: { status: TaskStatus }): React.JSX.Element {
  return <span className={`status-badge ${statusToneClass(props.status)}`}>{STATUS_LABELS[props.status]}</span>;
}

function getViewportKind(): ViewportKind {
  const width = window.innerWidth;
  if (width < 768) {
    return 'small';
  }
  if (width < 1180) {
    return 'tablet';
  }
  return 'desktop';
}

function hasActiveFiltering(search: string, filters: Filters): boolean {
  return Boolean(search.trim()) || Object.entries(filters).some(([key, value]) => {
    if (key === 'onlyOpen' || key === 'onlyChecklistOpen') {
      return Boolean(value);
    }
    return value !== 'all';
  });
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
  if (filters.onlyOpen && card.status === 'done') {
    return false;
  }
  if (filters.onlyChecklistOpen && card.checklistProgress.open === 0) {
    return false;
  }
  if (!matchesDueFilter(card.dueDate, filters.due)) {
    return false;
  }

  return true;
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

function sortCards(cards: TaskCardViewModel[], sort: TaskSort): TaskCardViewModel[] {
  return [...cards].sort((left, right) => {
    if (sort === 'due_date') {
      return compareDue(left.dueDate, right.dueDate) || comparePriority(left.priority, right.priority);
    }
    if (sort === 'priority') {
      return comparePriority(left.priority, right.priority) || compareDue(left.dueDate, right.dueDate);
    }
    if (sort === 'updated_at') {
      return right.updatedAt.localeCompare(left.updatedAt);
    }
    if (sort === 'alphabetical') {
      return left.title.localeCompare(right.title);
    }
    return (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER);
  });
}

function comparePriority(left: TaskPriority, right: TaskPriority): number {
  const weight = (priority: TaskPriority) => (priority === 'p1' ? 1 : priority === 'p2' ? 2 : 3);
  return weight(left) - weight(right);
}

function compareDue(left: string | null, right: string | null): number {
  if (left && right) {
    return left.localeCompare(right);
  }
  if (left) {
    return -1;
  }
  if (right) {
    return 1;
  }
  return 0;
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

function checklistProgressLabel(completed: number, total: number): string {
  if (total <= 0) {
    return 'Geen checklist';
  }

  const percent = Math.round((completed / total) * 100);
  return `${percent}% checklist (${completed}/${total})`;
}

function statusToneClass(status: TaskStatus): string {
  return STATUS_TONE_CLASS[status];
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
