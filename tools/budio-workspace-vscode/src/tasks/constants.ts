export const TASK_STATUSES = ['backlog', 'ready', 'in_progress', 'review', 'blocked', 'done'] as const;
export const TASK_PRIORITIES = ['p1', 'p2', 'p3'] as const;
export const TASK_WORKSTREAMS = ['idea', 'plugin', 'app', 'aiqs'] as const;
export const TASK_KINDS = ['task', 'subtask', 'research', 'polish'] as const;
export const TASK_SORTS = [
  'manual',
  'lane_order',
  'status',
  'due_date',
  'priority',
  'progress',
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

export const TASK_OPTIONAL_FIELDS = [
  'summary',
  'tags',
  'workstream',
  'due_date',
  'sort_order',
  'epic_id',
  'parent_task_id',
  'depends_on',
  'follows_after',
  'task_kind',
  'active_agent',
  'active_agent_model',
  'active_agent_runtime',
  'active_agent_since',
  'active_agent_status',
  'active_agent_settings',
] as const;

export const PLUGIN_OWNED_FRONTMATTER_FIELDS = [
  'title',
  'status',
  'priority',
  'summary',
  'tags',
  'workstream',
  'due_date',
  'sort_order',
  'epic_id',
  'parent_task_id',
  'depends_on',
  'follows_after',
  'task_kind',
  'updated_at',
  'active_agent',
  'active_agent_model',
  'active_agent_runtime',
  'active_agent_since',
  'active_agent_status',
  'active_agent_settings',
] as const;

export const DEFAULT_COLUMNS = [...TASK_STATUSES];

export const STATUS_LABELS: Record<(typeof TASK_STATUSES)[number], string> = {
  backlog: 'Backlog',
  ready: 'Ready',
  in_progress: 'In Progress',
  review: 'Review',
  blocked: 'Blocked',
  done: 'Done',
};

export const PRIORITY_LABELS: Record<(typeof TASK_PRIORITIES)[number], string> = {
  p1: 'P1',
  p2: 'P2',
  p3: 'P3',
};

export const WORKSTREAM_LABELS: Record<(typeof TASK_WORKSTREAMS)[number], string> = {
  idea: 'Idee',
  plugin: 'Plugin',
  app: 'Budio App',
  aiqs: 'AIQS',
};

export const CONCRETE_CHECKLIST_HEADING = 'Concrete checklist';
