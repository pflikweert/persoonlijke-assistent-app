import type {
  AiQualityFamilyKey,
  AiQualityFamilyReadModel,
  AiQualityFamilyTaskReadModel,
  AiQualityStudioReadModel,
  AiQualityTaskCapabilities,
  AiQualityTaskMetadata,
  AiTaskSummary,
} from '@/types';

type FamilyDefinition = {
  key: AiQualityFamilyKey;
  title: string;
  description: string;
  order: number;
  sharedRuntimeCall: boolean;
  editorEntryTaskKey: string | null;
};

type TaskDefinition = {
  label: string;
  familyKey: AiQualityFamilyKey | null;
  runtimeFamily: AiQualityTaskMetadata['runtimeFamily'];
  compositionRole: AiQualityTaskMetadata['compositionRole'];
  managedOutputField: string | null;
  affectedOutputFields: string[];
  sortOrder: number;
  visibleInFamily: boolean;
  sharedRuntimeCall: boolean;
  editorScope: AiQualityTaskMetadata['editorScope'];
  editorTargetTaskKey: string | null;
  capabilities: AiQualityTaskCapabilities;
};

const FAMILY_DEFINITIONS: FamilyDefinition[] = [
  {
    key: 'moments',
    title: 'Momenten',
    description: 'Entry normalisatie van één moment.',
    order: 1,
    sharedRuntimeCall: false,
    editorEntryTaskKey: 'entry_cleanup',
  },
  {
    key: 'today',
    title: 'Vandaag',
    description: 'Samenvatting en dagverhaal.',
    order: 2,
    sharedRuntimeCall: true,
    editorEntryTaskKey: 'day_summary',
  },
  {
    key: 'week',
    title: 'Week',
    description: 'Samenvatting, verhaal, highlights en reflectiepunten.',
    order: 3,
    sharedRuntimeCall: true,
    editorEntryTaskKey: 'week_summary',
  },
  {
    key: 'month',
    title: 'Maand',
    description: 'Samenvatting, verhaal, highlights en reflectiepunten.',
    order: 4,
    sharedRuntimeCall: true,
    editorEntryTaskKey: 'month_summary',
  },
];

const TASK_DEFINITIONS: Record<string, TaskDefinition> = {
  entry_cleanup: {
    label: 'Moment opschonen',
    familyKey: 'moments',
    runtimeFamily: 'entry_normalization',
    compositionRole: 'single',
    managedOutputField: 'entries_normalized',
    affectedOutputFields: ['title', 'body', 'summary_short'],
    sortOrder: 1,
    visibleInFamily: true,
    sharedRuntimeCall: false,
    editorScope: 'task',
    editorTargetTaskKey: 'entry_cleanup',
    capabilities: {
      canDraft: true,
      canTest: true,
      canCompare: true,
      canReview: true,
      canPromptAssist: true,
      allowedSourceTypes: ['entry'],
    },
  },
  day_summary: {
    label: 'Dag samenvatting',
    familyKey: 'today',
    runtimeFamily: 'day_journal',
    compositionRole: 'compound_part',
    managedOutputField: 'summary',
    affectedOutputFields: ['summary', 'narrative_text', 'sections'],
    sortOrder: 1,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'family',
    editorTargetTaskKey: 'day_summary',
    capabilities: {
      canDraft: true,
      canTest: true,
      canCompare: true,
      canReview: true,
      canPromptAssist: false,
      allowedSourceTypes: ['day'],
    },
  },
  day_narrative: {
    label: 'Dagverhaal',
    familyKey: 'today',
    runtimeFamily: 'day_journal',
    compositionRole: 'compound_part',
    managedOutputField: 'narrative_text',
    affectedOutputFields: ['summary', 'narrative_text', 'sections'],
    sortOrder: 2,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'read_only_part',
    editorTargetTaskKey: 'day_summary',
    capabilities: {
      canDraft: true,
      canTest: true,
      canCompare: true,
      canReview: true,
      canPromptAssist: false,
      allowedSourceTypes: ['day'],
    },
  },
  week_summary: {
    label: 'Week samenvatting',
    familyKey: 'week',
    runtimeFamily: 'reflection',
    compositionRole: 'compound_part',
    managedOutputField: 'summary_text',
    affectedOutputFields: ['summary_text', 'narrative_text', 'highlights_json', 'reflection_points_json'],
    sortOrder: 1,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'family',
    editorTargetTaskKey: 'week_summary',
    capabilities: {
      canDraft: true,
      canTest: false,
      canCompare: false,
      canReview: false,
      canPromptAssist: false,
      allowedSourceTypes: [],
    },
  },
  week_narrative: {
    label: 'Weekverhaal',
    familyKey: 'week',
    runtimeFamily: 'reflection',
    compositionRole: 'compound_part',
    managedOutputField: 'narrative_text',
    affectedOutputFields: ['summary_text', 'narrative_text', 'highlights_json', 'reflection_points_json'],
    sortOrder: 2,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'read_only_part',
    editorTargetTaskKey: 'week_summary',
    capabilities: {
      canDraft: true,
      canTest: false,
      canCompare: false,
      canReview: false,
      canPromptAssist: false,
      allowedSourceTypes: [],
    },
  },
  week_highlights: {
    label: 'Week highlights',
    familyKey: 'week',
    runtimeFamily: 'reflection',
    compositionRole: 'compound_part',
    managedOutputField: 'highlights_json',
    affectedOutputFields: ['summary_text', 'narrative_text', 'highlights_json', 'reflection_points_json'],
    sortOrder: 3,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'read_only_part',
    editorTargetTaskKey: 'week_summary',
    capabilities: {
      canDraft: true,
      canTest: false,
      canCompare: false,
      canReview: false,
      canPromptAssist: false,
      allowedSourceTypes: [],
    },
  },
  week_reflection_points: {
    label: 'Week reflectiepunten',
    familyKey: 'week',
    runtimeFamily: 'reflection',
    compositionRole: 'compound_part',
    managedOutputField: 'reflection_points_json',
    affectedOutputFields: ['summary_text', 'narrative_text', 'highlights_json', 'reflection_points_json'],
    sortOrder: 4,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'read_only_part',
    editorTargetTaskKey: 'week_summary',
    capabilities: {
      canDraft: true,
      canTest: false,
      canCompare: false,
      canReview: false,
      canPromptAssist: false,
      allowedSourceTypes: [],
    },
  },
  month_summary: {
    label: 'Maand samenvatting',
    familyKey: 'month',
    runtimeFamily: 'reflection',
    compositionRole: 'compound_part',
    managedOutputField: 'summary_text',
    affectedOutputFields: ['summary_text', 'narrative_text', 'highlights_json', 'reflection_points_json'],
    sortOrder: 1,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'family',
    editorTargetTaskKey: 'month_summary',
    capabilities: {
      canDraft: true,
      canTest: false,
      canCompare: false,
      canReview: false,
      canPromptAssist: false,
      allowedSourceTypes: [],
    },
  },
  month_narrative: {
    label: 'Maandverhaal',
    familyKey: 'month',
    runtimeFamily: 'reflection',
    compositionRole: 'compound_part',
    managedOutputField: 'narrative_text',
    affectedOutputFields: ['summary_text', 'narrative_text', 'highlights_json', 'reflection_points_json'],
    sortOrder: 2,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'read_only_part',
    editorTargetTaskKey: 'month_summary',
    capabilities: {
      canDraft: true,
      canTest: false,
      canCompare: false,
      canReview: false,
      canPromptAssist: false,
      allowedSourceTypes: [],
    },
  },
  month_highlights: {
    label: 'Maand highlights',
    familyKey: 'month',
    runtimeFamily: 'reflection',
    compositionRole: 'compound_part',
    managedOutputField: 'highlights_json',
    affectedOutputFields: ['summary_text', 'narrative_text', 'highlights_json', 'reflection_points_json'],
    sortOrder: 3,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'read_only_part',
    editorTargetTaskKey: 'month_summary',
    capabilities: {
      canDraft: true,
      canTest: false,
      canCompare: false,
      canReview: false,
      canPromptAssist: false,
      allowedSourceTypes: [],
    },
  },
  month_reflection_points: {
    label: 'Maand reflectiepunten',
    familyKey: 'month',
    runtimeFamily: 'reflection',
    compositionRole: 'compound_part',
    managedOutputField: 'reflection_points_json',
    affectedOutputFields: ['summary_text', 'narrative_text', 'highlights_json', 'reflection_points_json'],
    sortOrder: 4,
    visibleInFamily: true,
    sharedRuntimeCall: true,
    editorScope: 'read_only_part',
    editorTargetTaskKey: 'month_summary',
    capabilities: {
      canDraft: true,
      canTest: false,
      canCompare: false,
      canReview: false,
      canPromptAssist: false,
      allowedSourceTypes: [],
    },
  },
  entry_summary: {
    label: 'Entry summary',
    familyKey: null,
    runtimeFamily: 'unknown',
    compositionRole: 'legacy_hidden',
    managedOutputField: null,
    affectedOutputFields: [],
    sortOrder: 999,
    visibleInFamily: false,
    sharedRuntimeCall: false,
    editorScope: 'read_only_part',
    editorTargetTaskKey: null,
    capabilities: {
      canDraft: false,
      canTest: false,
      canCompare: false,
      canReview: false,
      canPromptAssist: false,
      allowedSourceTypes: [],
    },
  },
};

function componentCountLabel(totalCount: number, editableCount: number): string {
  if (editableCount <= 0) {
    return `${totalCount} ${totalCount === 1 ? 'onderdeel' : 'onderdelen'}`;
  }

  if (editableCount === 1 && totalCount > 1) {
    return `1 bewerkbare prompt · ${totalCount} onderdelen`;
  }

  if (editableCount === totalCount) {
    return `${editableCount} ${editableCount === 1 ? 'onderdeel' : 'onderdelen'}`;
  }

  return `${editableCount} bewerkbaar · ${totalCount} onderdelen`;
}

function statusSummary(items: AiQualityFamilyTaskReadModel[]): string {
  if (items.length === 0) return 'Niet ingesteld';

  const live = items.filter((item) => item.status === 'runtime').length;
  const draft = items.filter((item) => item.status === 'draft').length;

  if (live === items.length) return 'Runtime actief';
  if (live === 0 && draft === 0) return 'Niet ingesteld';
  if (live === 0 && draft > 0) return 'Draft actief';
  if (live > 0 && draft > 0) return 'Runtime + draft';
  return 'Deels actief';
}

export function getAiQualityTaskMetadata(taskKey: string, fallbackLabel?: string): AiQualityTaskMetadata {
  const definition = TASK_DEFINITIONS[taskKey];
  const fallbackCapabilities: AiQualityTaskCapabilities = {
    canDraft: true,
    canTest: false,
    canCompare: false,
    canReview: false,
    canPromptAssist: false,
    allowedSourceTypes: [],
  };

  if (!definition) {
    return {
      taskKey,
      taskLabel: fallbackLabel ?? taskKey,
      familyKey: null,
      familyTitle: null,
      familyDescription: null,
      runtimeFamily: 'unknown',
      compositionRole: 'legacy_hidden',
      managedOutputField: null,
      affectedOutputFields: [],
      sortOrder: 999,
      visibleInFamily: false,
      sharedRuntimeCall: false,
      editorScope: 'read_only_part',
      editorTargetTaskKey: null,
      capabilities: fallbackCapabilities,
    };
  }

  const family = definition.familyKey
    ? FAMILY_DEFINITIONS.find((item) => item.key === definition.familyKey) ?? null
    : null;

  return {
    taskKey,
    taskLabel: definition.label || fallbackLabel || taskKey,
    familyKey: definition.familyKey,
    familyTitle: family?.title ?? null,
    familyDescription: family?.description ?? null,
    runtimeFamily: definition.runtimeFamily,
    compositionRole: definition.compositionRole,
    managedOutputField: definition.managedOutputField,
    affectedOutputFields: definition.affectedOutputFields,
    sortOrder: definition.sortOrder,
    visibleInFamily: definition.visibleInFamily,
    sharedRuntimeCall: definition.sharedRuntimeCall,
    editorScope: definition.editorScope,
    editorTargetTaskKey: definition.editorTargetTaskKey,
    capabilities: definition.capabilities,
  };
}

export function getAiQualityTaskCapabilities(taskKey: string): AiQualityTaskCapabilities {
  return getAiQualityTaskMetadata(taskKey).capabilities;
}

export function getAiQualityTaskLabel(taskKey: string, fallbackLabel: string): string {
  return getAiQualityTaskMetadata(taskKey, fallbackLabel).taskLabel;
}

export function getAiQualityTaskStatus(task: AiTaskSummary): AiQualityFamilyTaskReadModel['status'] {
  if (task.liveVersion) return 'runtime';
  if (task.hasDraft) return 'draft';
  return 'missing';
}

export function buildAiQualityStudioReadModel(tasks: AiTaskSummary[]): AiQualityStudioReadModel {
  const visibleByFamily = new Map<AiQualityFamilyKey, AiQualityFamilyTaskReadModel[]>();
  const visibleTasks: AiTaskSummary[] = [];

  for (const task of tasks) {
    const metadata = getAiQualityTaskMetadata(task.key, task.label);
    if (!metadata.visibleInFamily || !metadata.familyKey) {
      continue;
    }
    visibleTasks.push(task);
    const items = visibleByFamily.get(metadata.familyKey) ?? [];
    items.push({
      task,
      metadata,
      status: getAiQualityTaskStatus(task),
    });
    visibleByFamily.set(metadata.familyKey, items);
  }

  const families = FAMILY_DEFINITIONS
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((family): AiQualityFamilyReadModel => {
      const tasksForFamily = (visibleByFamily.get(family.key) ?? []).sort((a, b) => {
        if (a.metadata.sortOrder !== b.metadata.sortOrder) {
          return a.metadata.sortOrder - b.metadata.sortOrder;
        }
        return a.task.key.localeCompare(b.task.key);
      });
      const editableTasksForFamily = tasksForFamily.filter((item) => item.metadata.editorScope !== 'read_only_part');

      return {
        key: family.key,
        title: family.title,
        description: family.description,
        componentCountLabel: componentCountLabel(tasksForFamily.length, editableTasksForFamily.length),
        statusSummary: statusSummary(tasksForFamily),
        sharedRuntimeCall: family.sharedRuntimeCall,
        editorScope: family.sharedRuntimeCall ? 'family' : 'task',
        editorEntryTaskKey: family.editorEntryTaskKey,
        tasks: tasksForFamily,
      };
    });

  return {
    families,
    visibleTasks,
  };
}

export function getAiQualityFamilyReadModel(
  tasks: AiTaskSummary[],
  familyKey: string
): AiQualityFamilyReadModel | null {
  const model = buildAiQualityStudioReadModel(tasks);
  return model.families.find((family) => family.key === familyKey) ?? null;
}

function findFamilyDefinition(familyKey: AiQualityFamilyKey | null) {
  if (!familyKey) return null;
  return FAMILY_DEFINITIONS.find((item) => item.key === familyKey) ?? null;
}

export function getAiQualityEditorTaskKey(taskKey: string, fallbackLabel?: string): string | null {
  const metadata = getAiQualityTaskMetadata(taskKey, fallbackLabel);
  if (metadata.compositionRole === 'legacy_hidden') return null;

  if (metadata.sharedRuntimeCall) {
    const family = findFamilyDefinition(metadata.familyKey);
    if (!family?.editorEntryTaskKey) return null;
    return family.editorEntryTaskKey;
  }

  return taskKey;
}

export function isAiQualitySharedGroupTask(taskKey: string, fallbackLabel?: string): boolean {
  return getAiQualityTaskMetadata(taskKey, fallbackLabel).sharedRuntimeCall;
}

export function shouldBypassAiQualityTaskOverview(taskKey: string, fallbackLabel?: string): boolean {
  const metadata = getAiQualityTaskMetadata(taskKey, fallbackLabel);
  return metadata.editorScope === 'read_only_part';
}

export function getAiQualityGroupPartMetadata(taskKey: string, fallbackLabel?: string): AiQualityTaskMetadata[] {
  const metadata = getAiQualityTaskMetadata(taskKey, fallbackLabel);
  if (!metadata.familyKey) return [];

  return Object.entries(TASK_DEFINITIONS)
    .map(([nextTaskKey, definition]) => ({
      taskKey: nextTaskKey,
      taskLabel: definition.label,
      familyKey: definition.familyKey,
      sortOrder: definition.sortOrder,
      visibleInFamily: definition.visibleInFamily,
    }))
    .filter((item) => item.familyKey === metadata.familyKey && item.visibleInFamily)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((item) => getAiQualityTaskMetadata(item.taskKey, item.taskLabel));
}

export function getAiQualityGroupEditorTaskKey(groupKey: string): string | null {
  const group = FAMILY_DEFINITIONS.find((item) => item.key === groupKey);
  return group?.editorEntryTaskKey ?? null;
}

export function getAiQualityGroupKeyForTask(taskKey: string, fallbackLabel?: string): AiQualityFamilyKey | null {
  const metadata = getAiQualityTaskMetadata(taskKey, fallbackLabel);
  return metadata.familyKey;
}

export function getAiQualityEditableTasksForFamily(
  tasks: AiTaskSummary[],
  familyKey: string
): AiQualityFamilyTaskReadModel[] {
  const family = getAiQualityFamilyReadModel(tasks, familyKey);
  if (!family) return [];
  return family.tasks.filter((item) => item.metadata.editorScope !== 'read_only_part');
}

export function shouldShowAiQualityGroupScreen(tasks: AiTaskSummary[], familyKey: string): boolean {
  return getAiQualityEditableTasksForFamily(tasks, familyKey).length > 1;
}

export function getAiQualityFamilyPrimaryTaskKey(tasks: AiTaskSummary[], familyKey: string): string | null {
  const family = getAiQualityFamilyReadModel(tasks, familyKey);
  if (!family) return null;

  const editableTasks = family.tasks.filter((item) => item.metadata.editorScope !== 'read_only_part');
  if (editableTasks.length > 0) {
    return editableTasks[0].task.key;
  }

  return family.editorEntryTaskKey;
}
