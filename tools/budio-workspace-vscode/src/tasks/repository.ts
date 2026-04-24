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

    const statusChanged = patch.status !== undefined && patch.status !== task.status;
    if (statusChanged && patch.status) {
      const taskMap = new Map(tasks.map((entry) => [entry.id, entry]));
      const writes = new Map<string, { sourcePath: string; targetPath: string; content: string }>();

      const sourceLaneIds = tasks
        .filter((entry) => entry.status === task.status && entry.id !== task.id)
        .sort((left, right) => (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER))
        .map((entry) => entry.id);

      const targetLaneIds = tasks
        .filter((entry) => entry.status === patch.status && entry.id !== task.id)
        .sort((left, right) => (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER))
        .map((entry) => entry.id);

      sourceLaneIds.forEach((id, index) => {
        const sourceTask = taskMap.get(id);
        if (!sourceTask) {
          return;
        }

        writes.set(id, {
          sourcePath: sourceTask.sourcePath,
          targetPath: sourceTask.sourcePath,
          content: applyTaskFieldPatch(sourceTask, { sortOrder: index + 1 }),
        });
      });

      const targetPath = await resolveUniqueTargetPath(
        buildTargetPathForStatus(task.sourcePath, this.workspaceRoot, this.tasksRootRelative, patch.status),
        task.sourcePath,
      );

      writes.set(task.id, {
        sourcePath: task.sourcePath,
        targetPath,
        content: applyTaskFieldPatch(task, {
          ...patch,
          sortOrder: 1,
        }),
      });

      targetLaneIds.forEach((id, index) => {
        const targetTask = taskMap.get(id);
        if (!targetTask) {
          return;
        }

        writes.set(id, {
          sourcePath: targetTask.sourcePath,
          targetPath: targetTask.sourcePath,
          content: applyTaskFieldPatch(targetTask, { sortOrder: index + 2 }),
        });
      });

      for (const write of writes.values()) {
        await writeTaskFile(write.sourcePath, write.targetPath, write.content);
      }

      return { taskId, path: path.relative(this.workspaceRoot, targetPath) };
    }

    const nextPath = patch.status
      ? await resolveUniqueTargetPath(
          buildTargetPathForStatus(task.sourcePath, this.workspaceRoot, this.tasksRootRelative, patch.status),
          task.sourcePath,
        )
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

    for (const [index, id] of destinationIds.entries()) {
      const destinationTask = id === task.id ? task : taskMap.get(id);
      if (!destinationTask) {
        continue;
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
          ? await resolveUniqueTargetPath(
              buildTargetPathForStatus(
                destinationTask.sourcePath,
                this.workspaceRoot,
                this.tasksRootRelative,
                input.targetStatus,
              ),
              destinationTask.sourcePath,
            )
          : destinationTask.sourcePath;

      const content = applyTaskFieldPatch(destinationTask, patch);
      writes.set(id, {
        sourcePath: destinationTask.sourcePath,
        targetPath: nextPath,
        content,
      });
    }

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
    const openFolder = path.resolve(this.workspaceRoot, this.tasksRootRelative, 'open');
    await fs.mkdir(openFolder, { recursive: true });

    let candidate = path.join(openFolder, `${slug}.md`);
    let suffix = 2;
    while (await exists(candidate)) {
      candidate = path.join(openFolder, `${slug}-${suffix}.md`);
      suffix += 1;
    }

    const phase = input.phase ?? mostCommonPhase(tasks) ?? 'transitiemaand-consumer-beta';
    const id = `task-${path.basename(candidate, '.md')}`;

    const laneTasks = tasks
      .filter((task) => task.status === input.status)
      .sort((left, right) => (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER));

    for (const [index, laneTask] of laneTasks.entries()) {
      const content = applyTaskFieldPatch(laneTask, {
        sortOrder: index + 2,
      });
      await writeTaskFile(laneTask.sourcePath, laneTask.sourcePath, content);
    }

    const content = buildNewTaskContent({
      ...input,
      id,
      phase,
      updatedAt: now,
      sortOrder: 1,
    });
    await fs.writeFile(candidate, content, 'utf8');
    return {
      taskId: id,
      path: path.relative(this.workspaceRoot, candidate),
    };
  }

  async deleteTask(taskId: string, expectedVersion: FileVersion): Promise<TaskMutationResult> {
    const tasks = await this.scan();
    const task = requireTask(tasks, taskId);
    assertVersion(task, expectedVersion);

    await fs.unlink(task.sourcePath);
    await cleanupTaskMapReferences({
      workspaceRoot: this.workspaceRoot,
      tasksRootRelative: this.tasksRootRelative,
      deletedTaskId: task.id,
      deletedTaskRelativePath: task.relativePath,
      deletedTaskAbsolutePath: task.sourcePath,
    });

    return {
      taskId,
      path: task.relativePath,
    };
  }

  async archiveTask(taskId: string, expectedVersion: FileVersion): Promise<TaskMutationResult> {
    const tasks = await this.scan();
    const task = requireTask(tasks, taskId);
    assertVersion(task, expectedVersion);

    const archivePath = await resolveUniqueTargetPath(
      path.resolve(
        this.workspaceRoot,
        this.tasksRootRelative,
        'archive',
        path.basename(task.sourcePath),
      ),
      task.sourcePath,
    );
    const nextContent = applyTaskFieldPatch(task, {
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    await writeTaskFile(task.sourcePath, archivePath, nextContent);
    return {
      taskId,
      path: path.relative(this.workspaceRoot, archivePath),
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

async function resolveUniqueTargetPath(candidate: string, sourcePath: string): Promise<string> {
  if (candidate === sourcePath) {
    return candidate;
  }

  let nextCandidate = candidate;
  let suffix = 2;

  while (await exists(nextCandidate)) {
    const extension = path.extname(candidate);
    const baseName = path.basename(candidate, extension);
    nextCandidate = path.join(path.dirname(candidate), `${baseName}-${suffix}${extension}`);
    suffix += 1;
  }

  return nextCandidate;
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

async function cleanupTaskMapReferences(input: {
  workspaceRoot: string;
  tasksRootRelative: string;
  deletedTaskId: string;
  deletedTaskRelativePath: string;
  deletedTaskAbsolutePath: string;
}): Promise<void> {
  const taskMapRoot = path.resolve(input.workspaceRoot, input.tasksRootRelative);
  const docsProjectRoot = path.resolve(input.workspaceRoot, 'docs/project');
  const deletedRelativeToDocsProject = toPosix(
    path.relative(docsProjectRoot, input.deletedTaskAbsolutePath),
  );
  const deletedRelativeToTaskMap = toPosix(path.relative(taskMapRoot, input.deletedTaskAbsolutePath));
  const deletedRelativeToWorkspace = toPosix(input.deletedTaskRelativePath);
  const deletedBaseName = path.basename(input.deletedTaskAbsolutePath);

  const referenceTokens = new Set<string>([
    input.deletedTaskId,
    deletedRelativeToWorkspace,
    deletedRelativeToDocsProject,
    deletedRelativeToTaskMap,
    deletedBaseName,
  ]);

  const markdownPaths = await collectMarkdownFiles(taskMapRoot);
  for (const markdownPath of markdownPaths) {
    if (path.resolve(markdownPath) === path.resolve(input.deletedTaskAbsolutePath)) {
      continue;
    }

    const current = await fs.readFile(markdownPath, 'utf8');
    const next = removeReferenceLines(current, referenceTokens);
    if (next !== current) {
      await fs.writeFile(markdownPath, next, 'utf8');
    }
  }
}

function removeReferenceLines(content: string, tokens: Set<string>): string {
  const lines = content.split('\n');
  const keptLines: string[] = [];

  for (const line of lines) {
    const shouldRemove = [...tokens].some((token) => token.length > 0 && line.includes(token));
    if (!shouldRemove) {
      keptLines.push(line);
    }
  }

  return keptLines.join('\n');
}

async function collectMarkdownFiles(rootDir: string): Promise<string[]> {
  if (!(await exists(rootDir))) {
    return [];
  }

  const stack = [rootDir];
  const files: string[] = [];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const nextPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(nextPath);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(nextPath);
      }
    }
  }

  return files;
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}
