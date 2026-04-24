import type {
  DEFAULT_COLUMNS,
  TASK_PRIORITIES,
  TASK_SORTS,
  TASK_STATUSES,
  TASK_WORKSTREAMS,
} from './constants';

export type TaskStatus = (typeof TASK_STATUSES)[number];
export type TaskPriority = (typeof TASK_PRIORITIES)[number];
export type TaskSort = (typeof TASK_SORTS)[number];
export type TaskWorkstream = (typeof TASK_WORKSTREAMS)[number];
export type TaskBucket = 'open' | 'done' | 'archived';
export type FrontmatterValue = string | number | boolean | string[] | null;

export interface FileVersion {
  mtimeMs: number;
  hash: string;
}

export interface ChecklistItem {
  index: number;
  text: string;
  checked: boolean;
}

export interface TaskSectionRange {
  heading: string;
  startLine: number;
  contentStartLine: number;
  endLineExclusive: number;
  lines: string[];
}

export interface ParsedTaskFile {
  id: string;
  title: string;
  status: TaskStatus;
  phase: string;
  priority: TaskPriority;
  source: string;
  updatedAt: string;
  summary: string;
  tags: string[];
  workstream: TaskWorkstream | null;
  dueDate: string | null;
  sortOrder: number | null;
  checklist: ChecklistItem[];
  bucket: TaskBucket;
  sourcePath: string;
  relativePath: string;
  folder: string;
  body: string;
  raw: string;
  excerpt: string;
  hasBody: boolean;
  lastModified: string;
  version: FileVersion;
  frontmatterValues: Record<string, FrontmatterValue>;
  frontmatterOrder: string[];
  bodyLines: string[];
  sections: Map<string, TaskSectionRange>;
  firstHeadingLineIndex: number | null;
  checklistLineIndexes: number[];
  activeAgent: string | null;
  activeAgentModel: string | null;
  activeAgentRuntime: string | null;
  activeAgentSince: string | null;
  activeAgentStatus: string | null;
  activeAgentSettings: string | null;
}

export interface TaskCardViewModel {
  id: string;
  title: string;
  status: TaskStatus;
  phase: string;
  priority: TaskPriority;
  tags: string[];
  workstream: TaskWorkstream | null;
  dueDate: string | null;
  checklistProgress: {
    completed: number;
    total: number;
    open: number;
  };
  summary: string;
  excerpt: string;
  sortOrder: number | null;
  checklist: ChecklistItem[];
  sourcePath: string;
  relativePath: string;
  folder: string;
  bucket: TaskBucket;
  updatedAt: string;
  lastModified: string;
  hasBody: boolean;
  bodyPreview: string;
  source: string;
  version: FileVersion;
  activeAgent: string | null;
  activeAgentModel: string | null;
  activeAgentRuntime: string | null;
  activeAgentSince: string | null;
  activeAgentStatus: string | null;
  activeAgentSettings: string | null;
}

export interface BoardColumn {
  key: TaskStatus;
  label: string;
  count: number;
  cards: TaskCardViewModel[];
}

export interface WorkspaceSettings {
  tasksRoot: string;
  columns: TaskStatus[];
  showDoneColumn: boolean;
  defaultSort: TaskSort;
}

export interface BoardSnapshot {
  workspaceName: string;
  workspacePath: string;
  tasksRoot: string;
  generatedAt: string;
  sort: TaskSort;
  columns: BoardColumn[];
  allCards: TaskCardViewModel[];
  totalTasks: number;
  openTaskCount: number;
  doneTaskCount: number;
  settings: WorkspaceSettings;
}

export interface TaskFieldPatch {
  title?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  summary?: string;
  tags?: string[];
  workstream?: TaskWorkstream | null;
  dueDate?: string | null;
  sortOrder?: number | null;
  updatedAt?: string;
  activeAgent?: string | null;
  activeAgentModel?: string | null;
  activeAgentRuntime?: string | null;
  activeAgentSince?: string | null;
  activeAgentStatus?: string | null;
  activeAgentSettings?: string | null;
}

export interface MoveTaskInput {
  taskId: string;
  expectedVersion: FileVersion;
  targetStatus: TaskStatus;
  destinationIds: string[];
  sourceIds: string[];
}

export interface CreateTaskInput {
  title: string;
  status: Exclude<TaskStatus, 'done'>;
  priority?: TaskPriority;
  phase?: string;
  source?: string;
  summary?: string;
  tags?: string[];
  workstream?: TaskWorkstream;
  dueDate?: string | null;
  sortOrder?: number | null;
}

export interface TaskMutationResult {
  taskId: string;
  path: string;
}

export interface MoveWritePlan {
  targetStatus: TaskStatus;
  targetBucket: TaskBucket;
  destinationPath: string;
  updates: Array<{
    task: ParsedTaskFile;
    nextPath: string;
    patch: TaskFieldPatch;
  }>;
}

export type DefaultColumns = typeof DEFAULT_COLUMNS;
