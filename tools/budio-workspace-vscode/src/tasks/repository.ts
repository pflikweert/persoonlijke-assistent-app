import fs from 'node:fs/promises';
import path from 'node:path';
import { scanTaskDocuments } from './scanner';
import { applyChecklistToggle, applyTaskFieldPatch, buildNewTaskContent, buildTargetPathForStatus } from './writer';
import type {
  CreateTaskInput,
  FileVersion,
  MoveTaskInput,
  ParsedTaskFile,
  TaskFieldPatch,
  TaskMutationResult,
} from './types';

export class TaskRepository {
  constructor(
    private readonly workspaceRoot: string,
    private readonly tasksRootRelative: string,
  ) {}

  async scan(): Promise<ParsedTaskFile[]> {
    return scanTaskDocuments(this.workspaceRoot, this.tasksRootRelative);
  }

  async updateTaskFields(
    taskId: string,
    expectedVersion: FileVersion,
    patch: TaskFieldPatch,
  ): Promise<TaskMutationResult> {
    const tasks = await this.scan();
    const task = requireTask(tasks, taskId);
    assertVersion(task, expectedVersion);

    const nextPath = patch.status
      ? buildTargetPathForStatus(task.sourcePath, this.workspaceRoot, this.tasksRootRelative, patch.status)
      : task.sourcePath;
    const nextContent = applyTaskFieldPatch(task, patch);

    await writeTaskFile(task.sourcePath, nextPath, nextContent);
    return { taskId, path: path.relative(this.workspaceRoot, nextPath) };
  }

  async toggleChecklistItem(
    taskId: string,
    expectedVersion: FileVersion,
    checklistIndex: number,
    checked: boolean,
  ): Promise<TaskMutationResult> {
    const tasks = await this.scan();
    const task = requireTask(tasks, taskId);
    assertVersion(task, expectedVersion);

    const nextContent = applyChecklistToggle(task, checklistIndex, checked);
    await writeTaskFile(task.sourcePath, task.sourcePath, nextContent);
    return { taskId, path: task.relativePath };
  }

  async moveTask(input: MoveTaskInput): Promise<TaskMutationResult> {
    const tasks = await this.scan();
    const task = requireTask(tasks, input.taskId);
    assertVersion(task, input.expectedVersion);

    const taskMap = new Map(tasks.map((entry) => [entry.id, entry]));
    const sourceIds = input.sourceIds.filter((id) => taskMap.get(id)?.status === task.status && id !== task.id);
    const destinationIds = input.destinationIds.filter(
      (id) =>
        id === task.id ||
        taskMap.get(id)?.status === input.targetStatus ||
        (taskMap.get(id)?.status === task.status && input.targetStatus === task.status),
    );

    const writes = new Map<string, { sourcePath: string; targetPath: string; content: string }>();

    sourceIds.forEach((id, index) => {
      const sourceTask = taskMap.get(id);
      if (!sourceTask) {
        return;
      }

      const content = applyTaskFieldPatch(sourceTask, {
        sortOrder: index + 1,
      });
      writes.set(id, {
        sourcePath: sourceTask.sourcePath,
        targetPath: sourceTask.sourcePath,
        content,
      });
    });

    destinationIds.forEach((id, index) => {
      const destinationTask = id === task.id ? task : taskMap.get(id);
      if (!destinationTask) {
        return;
      }

      const patch: TaskFieldPatch = {
        sortOrder: index + 1,
      };

      if (id === task.id) {
        patch.status = input.targetStatus;
        patch.updatedAt = new Date().toISOString().slice(0, 10);
      }

      const nextPath =
        id === task.id
          ? buildTargetPathForStatus(
              destinationTask.sourcePath,
              this.workspaceRoot,
              this.tasksRootRelative,
              input.targetStatus,
            )
          : destinationTask.sourcePath;

      const content = applyTaskFieldPatch(destinationTask, patch);
      writes.set(id, {
        sourcePath: destinationTask.sourcePath,
        targetPath: nextPath,
        content,
      });
    });

    for (const write of writes.values()) {
      await writeTaskFile(write.sourcePath, write.targetPath, write.content);
    }

    const moved = writes.get(task.id);
    return {
      taskId: task.id,
      path: path.relative(this.workspaceRoot, moved?.targetPath ?? task.sourcePath),
    };
  }

  async createTask(input: CreateTaskInput): Promise<TaskMutationResult> {
    const tasks = await this.scan();
    const now = new Date().toISOString().slice(0, 10);
    const slug = slugify(input.title);
    const id = `task-${slug}`;
    const openFolder = path.resolve(this.workspaceRoot, this.tasksRootRelative, 'open');
    await fs.mkdir(openFolder, { recursive: true });

    let candidate = path.join(openFolder, `${slug}.md`);
    let suffix = 2;
    while (await exists(candidate)) {
      candidate = path.join(openFolder, `${slug}-${suffix}.md`);
      suffix += 1;
    }

    const phase = input.phase ?? mostCommonPhase(tasks) ?? 'transitiemaand-consumer-beta';
    const content = buildNewTaskContent({
      ...input,
      id,
      phase,
      updatedAt: now,
    });
    await fs.writeFile(candidate, content, 'utf8');
    return {
      taskId: id,
      path: path.relative(this.workspaceRoot, candidate),
    };
  }
}

function requireTask(tasks: ParsedTaskFile[], taskId: string): ParsedTaskFile {
  const task = tasks.find((entry) => entry.id === taskId);
  if (!task) {
    throw new Error(`Task "${taskId}" kon niet worden gevonden.`);
  }
  return task;
}

function assertVersion(task: ParsedTaskFile, expectedVersion: FileVersion): void {
  if (
    task.version.hash !== expectedVersion.hash ||
    Math.round(task.version.mtimeMs) !== Math.round(expectedVersion.mtimeMs)
  ) {
    throw new Error(
      `Task "${task.title}" is gewijzigd op disk. Ververs het board en probeer het opnieuw.`,
    );
  }
}

async function writeTaskFile(sourcePath: string, targetPath: string, content: string): Promise<void> {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, content, 'utf8');
  if (sourcePath !== targetPath) {
    await fs.unlink(sourcePath);
  }
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function mostCommonPhase(tasks: ParsedTaskFile[]): string | null {
  const counts = new Map<string, number>();
  for (const task of tasks) {
    counts.set(task.phase, (counts.get(task.phase) ?? 0) + 1);
  }

  const best = [...counts.entries()].sort((left, right) => right[1] - left[1])[0];
  return best?.[0] ?? null;
}
