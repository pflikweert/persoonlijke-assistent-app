export type PromptEditorHtmlToken = {
  id: string;
  label: string;
  token: string;
};

function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/<\//g, '<\\/');
}

export function buildPromptEditorHtml(input: {
  initialText: string;
  placeholder?: string;
  tokens: PromptEditorHtmlToken[];
}): string {
  const initialPayload = safeJson({
    initialText: input.initialText,
    placeholder: input.placeholder ?? '',
    tokens: input.tokens,
  });

  return `<!doctype html>
<html lang="nl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <style>
      html, body { margin: 0; padding: 0; background: transparent; }
      #editor {
        padding: 12px 14px;
        min-height: 140px;
        font: 16px/1.5 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        color: #111827;
        white-space: pre-wrap;
        outline: none;
      }
      #editor .ProseMirror {
        white-space: pre-wrap;
        word-break: break-word;
        outline: none;
      }
      #editor .ProseMirror p { margin: 0; }
      #editor .ProseMirror p + p { margin-top: 12px; }
      #editor .variable-chip {
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
      }
      #editor .variable-chip-remove {
        border: 0;
        background: transparent;
        color: #1d4ed8;
        font-weight: 700;
        margin-left: 4px;
        line-height: 1;
        padding: 0 2px;
      }
      #editor .ProseMirror-focused { outline: none; }
      #editor .is-empty::before {
        content: attr(data-placeholder);
        color: #9ca3af;
        pointer-events: none;
        float: left;
        height: 0;
      }
    </style>
  </head>
  <body>
    <div id="editor"></div>

    <script type="application/json" id="prompt-editor-init">${initialPayload}</script>
    <script>
      const initRaw = document.getElementById('prompt-editor-init')?.textContent || '{}';
      const init = JSON.parse(initRaw);
      const tokenList = Array.isArray(init.tokens) ? init.tokens : [];
      const tokenById = new Map(tokenList.map((item) => [item.id, item]));

      const bridgePost = (type, payload = {}) => {
        const message = JSON.stringify({ type, payload });
        if (window.ReactNativeWebView && typeof window.ReactNativeWebView.postMessage === 'function') {
          window.ReactNativeWebView.postMessage(message);
        }
      };

      const normalizeTokenLiteral = (value) => String(value || '').replace(/\s+/g, '').toLowerCase();
      const tokenByLiteral = new Map(tokenList.map((item) => [normalizeTokenLiteral(item.token), item]));
      const tokenRegex = /\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g;
      const root = document.querySelector('#editor');
      root.setAttribute('contenteditable', 'true');
      root.setAttribute('spellcheck', 'false');
      root.setAttribute('autocapitalize', 'off');
      root.setAttribute('autocomplete', 'off');
      if (init.placeholder) {
        root.classList.add('is-empty');
        root.setAttribute('data-placeholder', init.placeholder);
      }

      const textToHtml = (text) => {
        const safe = String(text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const withTokens = safe.replace(tokenRegex, (raw) => {
          const token = tokenByLiteral.get(normalizeTokenLiteral(raw));
          if (!token) return raw;
          return '<span class="variable-chip" data-token-chip="true" data-token-id="' + token.id + '" data-token="' + token.token + '" contenteditable="false"><span class="variable-chip-label">' + token.label + '</span><button class="variable-chip-remove" data-token-remove="true" type="button">×</button></span>';
        });
        const withBreaks = withTokens.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');
        return withBreaks;
      };

      const extractTextFromNode = (node) => {
        if (!node) return '';
        if (node.nodeType === Node.TEXT_NODE) {
          return node.textContent || '';
        }
        if (node.nodeName === 'BR') {
          return '\n';
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node;
          if (el.classList.contains('variable-chip')) {
            return el.getAttribute('data-token') || '';
          }
          let out = '';
          el.childNodes.forEach((child) => {
            out += extractTextFromNode(child);
          });
          return out;
        }
        return '';
      };

      const snapshot = () => {
        const nodes = [];
        const tokenIds = [];
        const collectNodes = (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            nodes.push({ type: 'text', text: node.textContent || '' });
            return;
          }
          if (node.nodeName === 'BR') {
            nodes.push({ type: 'text', text: '\n' });
            return;
          }
          if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node;
            if (el.classList.contains('variable-chip')) {
              const id = el.getAttribute('data-token-id') || '';
              const token = el.getAttribute('data-token') || tokenById.get(id)?.token || '';
              tokenIds.push(id);
              nodes.push({
                type: 'variable',
                attrs: {
                  id,
                  label: el.querySelector('.variable-chip-label')?.textContent || id,
                  token,
                },
              });
              return;
            }
            el.childNodes.forEach((child) => collectNodes(child));
          }
        };

        root.childNodes.forEach((node) => collectNodes(node));

        const json = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: nodes,
            },
          ],
        };

        const text = nodes
          .map((item) => {
            if (item.type === 'text') return item.text || '';
            return item.attrs?.token || '';
          })
          .join('')
          .replace(/\r/g, '')
          .replace(/\n{3,}/g, '\n\n');

        const normalizedText = text.replace(/\n+$/g, '');

        if (!normalizedText && root.innerHTML !== '') {
          root.innerHTML = '';
        }

        root.classList.toggle('is-empty', normalizedText.trim().length === 0);
        bridgePost('editor_update', { json, text: normalizedText, tokenIds });
      };

      const insertTokenAtCursor = (token) => {
        const span = document.createElement('span');
        span.className = 'variable-chip';
        span.textContent = token.label;
        span.setAttribute('data-token-id', token.id);
        span.setAttribute('data-token', token.token);
        span.setAttribute('contenteditable', 'false');

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(span);
          range.setStartAfter(span);
          range.setEndAfter(span);
          selection.removeAllRanges();
          selection.addRange(range);
        } else {
          root.appendChild(span);
        }
        snapshot();
      };

      root.addEventListener('click', (event) => {
        const target = event.target;
        if (!target || !(target instanceof HTMLElement)) return;
        const remove = target.closest('[data-token-remove="true"]');
        if (!remove) return;
        const chip = remove.closest('[data-token-chip="true"]');
        if (chip && chip.parentNode) {
          chip.parentNode.removeChild(chip);
          snapshot();
        }
        event.preventDefault();
      });

      root.innerHTML = textToHtml(init.initialText || '');
      root.addEventListener('input', snapshot);
      root.addEventListener('focus', () => bridgePost('editor_focus'));
      root.addEventListener('blur', () => bridgePost('editor_blur'));

      const handleIncomingMessage = (raw) => {
        try {
          const message = JSON.parse(raw);
          const type = message?.type;
          const payload = message?.payload ?? {};
          if (type === 'set_content_text') {
            root.innerHTML = textToHtml(payload.text || '');
            snapshot();
            return;
          }
          if (type === 'insert_token') {
            const id = payload.id;
            const token = tokenById.get(id);
            if (!token) return;
            root.focus();
            insertTokenAtCursor(token);
            return;
          }
        } catch (error) {
          bridgePost('editor_error', { message: error instanceof Error ? error.message : String(error) });
        }
      };

      const onBridgeMessage = (event) => {
        const raw = typeof event?.data === 'string' ? event.data : '';
        if (!raw) return;
        handleIncomingMessage(raw);
      };

      window.addEventListener('message', onBridgeMessage);
      document.addEventListener('message', onBridgeMessage);

      bridgePost('editor_ready');
      snapshot();
    </script>
  </body>
</html>`;
}