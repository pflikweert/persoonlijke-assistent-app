import {
  AI_QUALITY_FAMILY_DEFINITIONS,
  getAiQualityFamilyDefinition,
  getAiQualityStaticTaskConfig,
} from '@/src/shared/ai-quality-runtime';
import type {
  AiQualityFamilyKey,
  AiQualityFamilyReadModel,
  AiQualityFamilyTaskReadModel,
  AiQualityStudioReadModel,
  AiQualityTaskCapabilities,
  AiQualityTaskMetadata,
  AiTaskSummary,
} from '@/types';

export function getAiQualityTaskMetadata(
  taskKey: string,
  fallbackLabel?: string,
  task?: AiTaskSummary | null
): AiQualityTaskMetadata {
  if (!task) {
    const staticConfig = getAiQualityStaticTaskConfig(taskKey);
    const family = getAiQualityFamilyDefinition(staticConfig.familyKey);
    return {
      taskKey,
      taskLabel: fallbackLabel ?? taskKey,
      familyKey: staticConfig.familyKey,
      familyTitle: family?.title ?? null,
      familyDescription: family?.description ?? null,
      runtimeBindingKey: null,
      runtimeFamily: 'unknown',
      compositionRole: 'legacy_hidden',
      managedOutputField: null,
      affectedOutputFields: staticConfig.affectedOutputFields,
      isRuntimeDriver: false,
      variantRole: null,
      sortOrder: staticConfig.sortOrder,
      visibleInFamily: staticConfig.visibleInFamily,
      sharedRuntimeCall: staticConfig.sharedRuntimeCall,
      editorScope: staticConfig.editorScope,
      editorTargetTaskKey: staticConfig.editorTargetTaskKey,
      capabilities: staticConfig.capabilities,
    };
  }

  const staticConfig = getAiQualityStaticTaskConfig(task.key);
  const family = getAiQualityFamilyDefinition(staticConfig.familyKey);

  return {
    taskKey: task.key,
    taskLabel: task.label,
    familyKey: staticConfig.familyKey,
    familyTitle: family?.title ?? null,
    familyDescription: family?.description ?? null,
    runtimeBindingKey: task.runtimeBindingKey,
    runtimeFamily: task.runtimeFamily,
    compositionRole: task.compositionRole,
    managedOutputField: task.managedOutputField,
    affectedOutputFields: staticConfig.affectedOutputFields,
    isRuntimeDriver: task.isRuntimeDriver,
    variantRole: task.variantRole,
    sortOrder: staticConfig.sortOrder,
    visibleInFamily: staticConfig.visibleInFamily,
    sharedRuntimeCall: staticConfig.sharedRuntimeCall,
    editorScope: staticConfig.editorScope,
    editorTargetTaskKey: staticConfig.editorTargetTaskKey,
    capabilities: staticConfig.capabilities,
  };
}

export function getAiQualityTaskCapabilities(taskKey: string): AiQualityTaskCapabilities {
  return getAiQualityStaticTaskConfig(taskKey).capabilities;
}

export function getAiQualityTaskLabel(taskKey: string, fallbackLabel?: string): string {
  return fallbackLabel ?? taskKey;
}

export function buildAiQualityStudioReadModel(tasks: AiTaskSummary[]): AiQualityStudioReadModel {
  const tasksWithMetadata = tasks
    .map((task) => ({
      task,
      metadata: getAiQualityTaskMetadata(task.key, task.label, task),
    }))
    .filter((item) => item.metadata.compositionRole !== 'legacy_hidden');

  const families: AiQualityFamilyReadModel[] = AI_QUALITY_FAMILY_DEFINITIONS.map((family) => {
    const tasksForFamily = tasksWithMetadata
      .filter((item) => item.metadata.familyKey === family.key)
      .sort((a, b) => a.metadata.sortOrder - b.metadata.sortOrder);

    const familyTasks: AiQualityFamilyTaskReadModel[] = tasksForFamily.map((item) => ({
      task: item.task,
      metadata: item.metadata,
      status: item.task.liveVersion ? 'runtime' : item.task.hasDraft ? 'draft' : 'missing',
    }));

    const visibleTasks = familyTasks.filter((item) => item.metadata.visibleInFamily);
    const runtimeDriver = visibleTasks.find((item) => item.metadata.isRuntimeDriver) ?? null;
    const taskCount = visibleTasks.length;
    const runtimeCount = visibleTasks.filter((item) => item.task.liveVersion).length;
    const variantCount = visibleTasks.filter(
      (item) => item.metadata.compositionRole === 'runtime_variant'
    ).length;

    return {
      key: family.key,
      title: family.title,
      description: family.description,
      componentCountLabel:
        variantCount > 0
          ? `${taskCount} prompts, ${variantCount} runtime-varianten`
          : `${taskCount} prompts`,
      statusSummary: `${runtimeCount}/${taskCount} live`,
      sharedRuntimeCall: family.sharedRuntimeCall,
      editorScope: family.sharedRuntimeCall ? 'family' : 'task',
      editorEntryTaskKey: runtimeDriver?.task.key ?? family.editorEntryTaskKey,
      tasks: visibleTasks,
    };
  });

  return {
    families,
    visibleTasks: tasksWithMetadata
      .filter((item) => item.metadata.visibleInFamily)
      .map((item) => item.task),
  };
}

export function getAiQualityFamilyReadModel(
  tasks: AiTaskSummary[],
  groupKey: string
): AiQualityFamilyReadModel | null {
  const model = buildAiQualityStudioReadModel(tasks);
  return model.families.find((family) => family.key === groupKey) ?? null;
}

export function getAiQualityFamilyPrimaryTaskKey(
  tasks: AiTaskSummary[],
  groupKey: string
): string | null {
  return getAiQualityFamilyReadModel(tasks, groupKey)?.editorEntryTaskKey ?? null;
}

export function shouldShowAiQualityGroupScreen(
  tasks: AiTaskSummary[],
  groupKey: string
): boolean {
  const family = getAiQualityFamilyReadModel(tasks, groupKey);
  return Boolean(family && family.sharedRuntimeCall);
}

export function getAiQualityPrimaryTaskKey(
  tasks: AiTaskSummary[],
  taskKey: string,
  fallbackLabel?: string
): string | null {
  const task = tasks.find((item) => item.key === taskKey) ?? null;
  const metadata = getAiQualityTaskMetadata(taskKey, fallbackLabel, task);
  if (metadata.compositionRole === 'legacy_hidden') return null;
  if (metadata.editorScope === 'task') return taskKey;
  if (metadata.editorTargetTaskKey) {
    return metadata.editorTargetTaskKey;
  }

  const family = getAiQualityFamilyDefinition(metadata.familyKey);
  return family?.editorEntryTaskKey ?? null;
}

export function isAiQualityTaskSharedRuntime(
  taskKey: string,
  task?: AiTaskSummary | null
): boolean {
  const metadata = getAiQualityTaskMetadata(taskKey, task?.label, task);
  return metadata.sharedRuntimeCall;
}

export function isAiQualityReadOnlyPart(
  taskKey: string,
  task?: AiTaskSummary | null
): boolean {
  const metadata = getAiQualityTaskMetadata(taskKey, task?.label, task);
  return metadata.editorScope === 'read_only_part';
}

export function shouldBypassAiQualityTaskOverview(
  taskKey: string,
  taskOrLabel?: AiTaskSummary | string | null
): boolean {
  const task =
    taskOrLabel && typeof taskOrLabel === 'object' ? (taskOrLabel as AiTaskSummary) : null;
  const fallbackLabel = typeof taskOrLabel === 'string' ? taskOrLabel : task?.label;
  const metadata = getAiQualityTaskMetadata(taskKey, fallbackLabel, task);
  return metadata.editorScope === 'read_only_part';
}

export function getAiQualityGroupPartMetadata(
  taskKey: string,
  tasks: AiTaskSummary[]
): AiQualityTaskMetadata[] {
  const task = tasks.find((item) => item.key === taskKey) ?? null;
  const metadata = getAiQualityTaskMetadata(taskKey, task?.label, task);
  if (!metadata.familyKey) {
    return [];
  }

  return tasks
    .filter((item) => getAiQualityTaskMetadata(item.key, item.label, item).familyKey === metadata.familyKey)
    .map((item) => getAiQualityTaskMetadata(item.key, item.label, item))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getAiQualityGroupEditorEntryTaskKey(
  groupKey: string
): string | null {
  return getAiQualityFamilyDefinition(groupKey as AiQualityFamilyKey)?.editorEntryTaskKey ?? null;
}

export function getAiQualityEditableTasksForFamily(
  tasks: AiTaskSummary[],
  groupKey: string
): AiQualityFamilyTaskReadModel[] {
  const family = getAiQualityFamilyReadModel(tasks, groupKey);
  return family?.tasks.filter((task) => task.metadata.editorScope !== 'read_only_part') ?? [];
}

export function getAiQualityTaskStatus(
  task: AiTaskSummary
): 'runtime' | 'draft' | 'missing' {
  if (task.liveVersion) {
    return 'runtime';
  }
  if (task.hasDraft) {
    return 'draft';
  }
  return 'missing';
}
