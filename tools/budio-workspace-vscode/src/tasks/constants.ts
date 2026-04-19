export const TASK_STATUSES = ['backlog', 'ready', 'in_progress', 'blocked', 'done'] as const;
export const TASK_PRIORITIES = ['p1', 'p2', 'p3'] as const;
export const TASK_SORTS = [
  'manual',
  'due_date',
  'priority',
  'updated_at',
  'alphabetical',
] as const;

export const TASK_REQUIRED_FIELDS = [
  'id',
  'title',
  'status',
  'phase',
  'priority',
  'source',
  'updated_at',
] as const;

export const TASK_OPTIONAL_FIELDS = ['summary', 'tags', 'due_date', 'sort_order'] as const;

export const PLUGIN_OWNED_FRONTMATTER_FIELDS = [
  'title',
  'status',
  'priority',
  'summary',
  'tags',
  'due_date',
  'sort_order',
  'updated_at',
] as const;

export const DEFAULT_COLUMNS = [...TASK_STATUSES];

export const STATUS_LABELS: Record<(typeof TASK_STATUSES)[number], string> = {
  backlog: 'Backlog',
  ready: 'Ready',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
};

export const PRIORITY_LABELS: Record<(typeof TASK_PRIORITIES)[number], string> = {
  p1: 'P1',
  p2: 'P2',
  p3: 'P3',
};

export const CONCRETE_CHECKLIST_HEADING = 'Concrete checklist';
