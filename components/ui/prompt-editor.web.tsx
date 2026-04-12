import { Editor } from '@tiptap/core';
import MentionExtension from '@tiptap/extension-mention';
import StarterKitExtension from '@tiptap/starter-kit';
import { useEffect, useMemo, useRef } from 'react';

import {
  collectTokenIds,
  docToText,
  textToDoc,
  type PromptEditorDocument,
  type PromptEditorProps,
} from './prompt-editor-types';

export type { PromptEditorState } from './prompt-editor-types';

type SelectionRange = {
  from: number;
  to: number;
};

export function PromptEditor({
  value,
  placeholder,
  minHeight = 140,
  tokens,
  requestInsertTokenId,
  onInsertTokenHandled,
  onChangeText,
  onStateChange,
}: PromptEditorProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Editor | null>(null);
  const latestTextRef = useRef(value);
  const isFocusedRef = useRef(false);
  const pendingExternalValueRef = useRef<string | null>(null);
  const lastSelectionRef = useRef<SelectionRange | null>(null);
  const onChangeTextRef = useRef(onChangeText);
  const onStateChangeRef = useRef(onStateChange);
  const onInsertTokenHandledRef = useRef(onInsertTokenHandled);

  useEffect(() => {
    onChangeTextRef.current = onChangeText;
  }, [onChangeText]);

  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);

  useEffect(() => {
    onInsertTokenHandledRef.current = onInsertTokenHandled;
  }, [onInsertTokenHandled]);

  const tokenKey = useMemo(() => tokens.map((item) => `${item.id}:${item.label}:${item.token}`).join('|'), [tokens]);

  const variableExtension = useMemo(
    () =>
      MentionExtension.extend({
        name: 'variable',
      }).configure({
        deleteTriggerWithBackspace: true,
        HTMLAttributes: {
          class: 'variable-chip',
          contenteditable: 'false',
        },
        renderText({ node }) {
          return node.attrs?.label || node.attrs?.id || 'token';
        },
        renderHTML({ node }) {
          const label = node.attrs?.label || node.attrs?.id || 'token';
          return [
            'span',
            {
              class: 'variable-chip',
              contenteditable: 'false',
              'data-token-chip': 'true',
            },
            ['span', { class: 'variable-chip-label' }, label],
            ['button', { class: 'variable-chip-remove', 'data-token-remove': 'true', type: 'button' }, '×'],
          ];
        },
      }),
    []
  );

  useEffect(() => {
    if (!mountRef.current) return;

    const editor = new Editor({
      element: mountRef.current,
      extensions: [StarterKitExtension, variableExtension],
      content: textToDoc(value, tokens),
      editorProps: {
        attributes: {
          spellcheck: 'false',
          autocapitalize: 'off',
          autocomplete: 'off',
          'data-placeholder': placeholder || '',
          class: 'prompt-editor-prosemirror',
        },
        handleDOMEvents: {
          click: (view, event) => {
            const target = event.target as HTMLElement | null;
            if (!target) return false;
            const removeButton = target.closest('[data-token-remove="true"]');
            if (!removeButton) return false;
            const chip = removeButton.closest('[data-token-chip="true"]');
            if (!chip) return false;
            const position = view.posAtDOM(chip, 0);
            const node = view.state.doc.nodeAt(position);
            if (!node) return false;
            const tr = view.state.tr.delete(position, position + node.nodeSize);
            view.dispatch(tr);
            event.preventDefault();
            return true;
          },
        },
      },
      onUpdate({ editor: currentEditor }) {
        const json = currentEditor.getJSON() as PromptEditorDocument;
        const text = docToText(json, tokens);
        latestTextRef.current = text;
        onChangeTextRef.current(text);
        onStateChangeRef.current?.({
          json,
          text,
          tokenIds: collectTokenIds(json),
        });
      },
      onFocus() {
        isFocusedRef.current = true;
        const selection = editor.state.selection;
        lastSelectionRef.current = {
          from: selection.from,
          to: selection.to,
        };
      },
      onSelectionUpdate({ editor: currentEditor }) {
        if (!currentEditor.isFocused) return;
        const selection = currentEditor.state.selection;
        lastSelectionRef.current = {
          from: selection.from,
          to: selection.to,
        };
      },
      onBlur({ editor: currentEditor }) {
        isFocusedRef.current = false;
        const pending = pendingExternalValueRef.current;
        if (pending !== null && pending !== latestTextRef.current) {
          currentEditor.commands.setContent(textToDoc(pending, tokens), { emitUpdate: false });
          latestTextRef.current = pending;
        }
        pendingExternalValueRef.current = null;
      },
    });

    editorRef.current = editor;

    return () => {
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  // Keep editor instance stable while typing; live content sync is handled in separate effects.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeholder, tokenKey, variableExtension]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (value === latestTextRef.current) return;

    if (isFocusedRef.current) {
      pendingExternalValueRef.current = value;
      return;
    }

    editor.commands.setContent(textToDoc(value, tokens), { emitUpdate: false });
    latestTextRef.current = value;
    pendingExternalValueRef.current = null;
  }, [tokens, value]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !requestInsertTokenId) return;
    const token = tokens.find((item) => item.id === requestInsertTokenId);
    if (!token) {
      onInsertTokenHandledRef.current?.();
      return;
    }

    const savedSelection = lastSelectionRef.current;
    if (savedSelection) {
      const docSize = editor.state.doc.content.size;
      const from = Math.max(1, Math.min(savedSelection.from, docSize));
      const to = Math.max(1, Math.min(savedSelection.to, docSize));
      editor
        .chain()
        .insertContentAt(
          { from, to },
          {
            type: 'variable',
            attrs: {
              id: token.id,
              label: token.label,
              token: token.token,
            },
          }
        )
        .setTextSelection(Math.min(from + 1, editor.state.doc.content.size))
        .focus()
        .run();
    } else {
      editor
        .chain()
        .focus()
        .insertContent({
          type: 'variable',
          attrs: {
            id: token.id,
            label: token.label,
            token: token.token,
          },
        })
        .run();
    }

    const selection = editor.state.selection;
    lastSelectionRef.current = {
      from: selection.from,
      to: selection.to,
    };

    onInsertTokenHandledRef.current?.();
  }, [requestInsertTokenId, tokens]);

  return (
    <div style={{ width: '100%', minHeight }}>
      <style>
        {`.prompt-editor-prosemirror p { margin: 0; }
          .prompt-editor-prosemirror p + p { margin-top: 12px; }
          .prompt-editor-prosemirror .variable-chip {
            display: inline-flex;
            align-items: center;
            border-radius: 999px;
            padding: 2px 4px 2px 8px;
            margin: 0 2px;
            background: #dbeafe;
            color: #1d4ed8;
            font-size: 0.9em;
            font-weight: 600;
            vertical-align: baseline;
            user-select: none;
          }
          .prompt-editor-prosemirror .variable-chip-remove {
            border: 0;
            background: transparent;
            color: #1d4ed8;
            font-weight: 700;
            margin-left: 4px;
            cursor: pointer;
            line-height: 1;
            padding: 0 2px;
          }`}
      </style>
      <div
        ref={mountRef}
        style={{
          minHeight,
          padding: '12px 14px',
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          font: '16px/1.5 -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          color: '#111827',
        }}
      />
    </div>
  );
}

