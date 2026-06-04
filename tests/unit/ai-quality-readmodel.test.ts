import { describe, expect, it } from 'vitest';

import {
  getAiQualityEditableTasksForFamily,
  getAiQualityFamilyReadModel,
  getAiQualityTaskMetadata,
} from '@/services/ai-quality-studio/readmodel';
import type { AiTaskSummary } from '@/types';

function buildTask(input: Partial<AiTaskSummary> & Pick<AiTaskSummary, 'id' | 'key' | 'label'>): AiTaskSummary {
  return {
    id: input.id,
    key: input.key,
    label: input.label,
    inputType: input.inputType ?? 'day',
    outputType: input.outputType ?? 'text',
    description: input.description ?? null,
    isActive: input.isActive ?? true,
    runtimeBindingKey: input.runtimeBindingKey ?? null,
    runtimeFamily: input.runtimeFamily ?? 'unknown',
    compositionRole: input.compositionRole ?? 'legacy_hidden',
    managedOutputField: input.managedOutputField ?? null,
    isRuntimeDriver: input.isRuntimeDriver ?? false,
    variantRole: input.variantRole ?? null,
    hasDraft: input.hasDraft ?? false,
    createdAt: input.createdAt ?? '2026-06-02T00:00:00.000Z',
    updatedAt: input.updatedAt ?? '2026-06-02T00:00:00.000Z',
    liveVersion: input.liveVersion ?? null,
  };
}

describe('ai-quality readmodel', () => {
  const tasks: AiTaskSummary[] = [
    buildTask({
      id: 'week-summary',
      key: 'week_summary',
      label: 'Weeksamenvatting',
      inputType: 'week',
      runtimeFamily: 'week_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'summary_text',
    }),
    buildTask({
      id: 'week-narrative',
      key: 'week_narrative',
      label: 'Weekverhaal',
      inputType: 'week',
      runtimeBindingKey: 'week_reflection.primary',
      runtimeFamily: 'week_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'narrative_text',
      isRuntimeDriver: true,
      variantRole: 'primary',
    }),
    buildTask({
      id: 'week-highlights',
      key: 'week_highlights',
      label: 'Weekhighlights',
      inputType: 'week',
      outputType: 'text_list',
      runtimeFamily: 'week_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'highlights_json',
    }),
    buildTask({
      id: 'week-points',
      key: 'week_reflection_points',
      label: 'Weekreflectiepunten',
      inputType: 'week',
      outputType: 'text_list',
      runtimeFamily: 'week_reflection',
      compositionRole: 'compound_member',
      managedOutputField: 'reflection_points_json',
    }),
    buildTask({
      id: 'day-narrative',
      key: 'day_narrative',
      label: 'Dagverhaal',
      runtimeBindingKey: 'day_journal.primary',
      runtimeFamily: 'day_journal',
      compositionRole: 'compound_member',
      managedOutputField: 'narrative_text',
      isRuntimeDriver: true,
      variantRole: 'primary',
    }),
    buildTask({
      id: 'day-repair',
      key: 'day_journal_repair',
      label: 'Dagverhaal repair',
      runtimeBindingKey: 'day_journal.repair',
      runtimeFamily: 'day_journal',
      compositionRole: 'runtime_variant',
      managedOutputField: 'narrative_text',
      variantRole: 'repair',
    }),
  ];

  it('keeps read-only compound members visible in the family readmodel', () => {
    const family = getAiQualityFamilyReadModel(tasks, 'week');

    expect(family?.editorEntryTaskKey).toBe('week_narrative');
    expect(family?.tasks.map((item) => item.task.key)).toEqual([
      'week_summary',
      'week_narrative',
      'week_highlights',
      'week_reflection_points',
    ]);
  });

  it('limits editable family tasks to runtime-driver and technical variants', () => {
    expect(getAiQualityEditableTasksForFamily(tasks, 'week').map((item) => item.task.key)).toEqual([
      'week_narrative',
    ]);

    expect(getAiQualityEditableTasksForFamily(tasks, 'today').map((item) => item.task.key)).toEqual([
      'day_narrative',
      'day_journal_repair',
    ]);
  });

  it('maps runtime metadata for read-only members and repair variants', () => {
    const weekSummary = getAiQualityTaskMetadata('week_summary', 'Weeksamenvatting');
    const dayRepairTask = tasks.find((task) => task.key === 'day_journal_repair') ?? null;
    const dayRepair = getAiQualityTaskMetadata(
      'day_journal_repair',
      'Dagverhaal repair',
      dayRepairTask
    );

    expect(weekSummary.editorScope).toBe('read_only_part');
    expect(weekSummary.editorTargetTaskKey).toBe('week_narrative');
    expect(dayRepair.variantRole).toBe('repair');
    expect(dayRepair.visibleInFamily).toBe(true);
  });
});
