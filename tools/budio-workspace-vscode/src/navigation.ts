export type WorkspaceView = 'board' | 'list' | 'epics' | 'settings';

export type WorkspaceNavigationItem =
  | {
      id: WorkspaceView;
      kind: 'view';
      label: string;
      icon: string;
    }
  | {
      id: 'refresh';
      kind: 'action';
      label: string;
      icon: string;
    };

export const WORKSPACE_VIEW_TITLES: Record<WorkspaceView, string> = {
  board: 'Board',
  list: 'List',
  epics: 'Epics',
  settings: 'Settings',
};

export const WORKSPACE_NAVIGATION_ITEMS: WorkspaceNavigationItem[] = [
  { id: 'board', kind: 'view', label: 'Board', icon: '▥' },
  { id: 'list', kind: 'view', label: 'List', icon: '☰' },
  { id: 'epics', kind: 'view', label: 'Epics', icon: '◎' },
  { id: 'settings', kind: 'view', label: 'Settings', icon: '⚙' },
  { id: 'refresh', kind: 'action', label: 'Refresh', icon: '↻' },
];
