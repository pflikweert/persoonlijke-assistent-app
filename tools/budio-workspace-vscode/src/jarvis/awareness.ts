import { isTaskAgentActive } from '../tasks/task-ux';
import type { BoardSnapshot, TaskCardViewModel } from '../tasks/types';

export interface JarvisAgentActivity {
  taskId: string;
  taskTitle: string;
  taskStatus: string;
  agent: string;
  model: string | null;
  runtime: string | null;
  since: string | null;
  status: string | null;
  settings: string | null;
  relativePath: string;
}

export interface JarvisFocusItem {
  taskId: string;
  title: string;
  status: string;
  priority: string;
  agent: string | null;
}

export interface JarvisWorkspaceAwareness {
  loaded: boolean;
  workspaceName: string | null;
  generatedAt: string | null;
  totalTasks: number;
  openTaskCount: number;
  doneTaskCount: number;
  focusItems: JarvisFocusItem[];
  activeAgents: JarvisAgentActivity[];
}

export function buildJarvisWorkspaceAwareness(snapshot: BoardSnapshot | null): JarvisWorkspaceAwareness {
  if (!snapshot) {
    return {
      loaded: false,
      workspaceName: null,
      generatedAt: null,
      totalTasks: 0,
      openTaskCount: 0,
      doneTaskCount: 0,
      focusItems: [],
      activeAgents: [],
    };
  }

  const activeAgents = snapshot.allCards
    .filter((task) => isTaskAgentActive(task))
    .map(toAgentActivity)
    .slice(0, 6);

  const focusItems = [...snapshot.allCards]
    .sort(compareJarvisFocus)
    .slice(0, 6)
    .map((task) => ({
      taskId: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      agent: isTaskAgentActive(task) ? task.activeAgent : null,
    }));

  return {
    loaded: true,
    workspaceName: snapshot.workspaceName,
    generatedAt: snapshot.generatedAt,
    totalTasks: snapshot.totalTasks,
    openTaskCount: snapshot.openTaskCount,
    doneTaskCount: snapshot.doneTaskCount,
    focusItems,
    activeAgents,
  };
}

function toAgentActivity(task: TaskCardViewModel): JarvisAgentActivity {
  return {
    taskId: task.id,
    taskTitle: task.title,
    taskStatus: task.status,
    agent: task.activeAgent ?? 'Agent',
    model: task.activeAgentModel,
    runtime: task.activeAgentRuntime,
    since: task.activeAgentSince,
    status: task.activeAgentStatus,
    settings: task.activeAgentSettings,
    relativePath: task.relativePath,
  };
}

function compareJarvisFocus(left: TaskCardViewModel, right: TaskCardViewModel): number {
  const leftScore = focusScore(left);
  const rightScore = focusScore(right);
  if (leftScore !== rightScore) {
    return rightScore - leftScore;
  }
  return (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER);
}

function focusScore(task: TaskCardViewModel): number {
  if (isTaskAgentActive(task)) {
    return 100;
  }
  if (task.status === 'in_progress') {
    return 80;
  }
  if (task.status === 'blocked') {
    return 70;
  }
  if (task.status === 'review') {
    return 60;
  }
  if (task.status === 'ready') {
    return 50;
  }
  if (task.isReadyToStart) {
    return 40;
  }
  return 10;
}
