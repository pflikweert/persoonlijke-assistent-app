import type { ChecklistItem, TaskCardViewModel, TaskDetailPreviewSection } from './types';

export function getDetailPreviewSections(task: Partial<TaskCardViewModel>): TaskDetailPreviewSection[] {
  if (!Array.isArray(task.detailPreviewSections)) {
    return [];
  }

  return task.detailPreviewSections.filter((section): section is TaskDetailPreviewSection => {
    return (
      typeof section === 'object' &&
      section !== null &&
      typeof section.heading === 'string' &&
      section.heading.trim().length > 0 &&
      typeof section.body === 'string' &&
      section.body.trim().length > 0
    );
  });
}

export function getSafeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry): entry is string => typeof entry === 'string');
}

export function getSafeChecklistItems(value: unknown): ChecklistItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is ChecklistItem => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof item.index === 'number' &&
      typeof item.text === 'string' &&
      typeof item.checked === 'boolean'
    );
  });
}
