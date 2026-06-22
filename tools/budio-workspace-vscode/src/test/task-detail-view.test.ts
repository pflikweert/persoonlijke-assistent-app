import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getDetailPreviewSections,
  getSafeChecklistItems,
  getSafeStringArray,
} from '../tasks/task-detail-view';

test('getDetailPreviewSections tolerates missing or malformed retained webview payloads', () => {
  assert.deepEqual(getDetailPreviewSections({}), []);
  assert.deepEqual(getDetailPreviewSections({ detailPreviewSections: null } as never), []);
  assert.deepEqual(getDetailPreviewSections({ detailPreviewSections: 'stale' } as never), []);
  assert.deepEqual(
    getDetailPreviewSections({
      detailPreviewSections: [
        { heading: 'Probleem / context', body: 'Werkende sectie.' },
        { heading: '', body: 'Geen heading.' },
        { heading: 'Gewenste uitkomst', body: '' },
        null,
      ],
    } as never),
    [{ heading: 'Probleem / context', body: 'Werkende sectie.' }],
  );
});

test('getSafeStringArray only keeps string entries', () => {
  assert.deepEqual(getSafeStringArray(undefined), []);
  assert.deepEqual(getSafeStringArray(['a', 1, 'b', null]), ['a', 'b']);
});

test('getSafeChecklistItems only keeps valid checklist rows', () => {
  assert.deepEqual(getSafeChecklistItems(null), []);
  assert.deepEqual(
    getSafeChecklistItems([
      { index: 0, text: 'Goed item', checked: false },
      { index: '1', text: 'Verkeerde index', checked: false },
      { index: 2, text: 'Tweede item', checked: true },
    ]),
    [
      { index: 0, text: 'Goed item', checked: false },
      { index: 2, text: 'Tweede item', checked: true },
    ],
  );
});
