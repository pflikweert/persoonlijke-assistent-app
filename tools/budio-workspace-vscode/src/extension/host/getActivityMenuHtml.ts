import * as vscode from 'vscode';
import {
  WORKSPACE_NAVIGATION_ITEMS,
  WORKSPACE_VIEW_TITLES,
  type WorkspaceView,
} from '../../navigation';

function createNonce(): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let index = 0; index < 32; index += 1) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function getActivityMenuHtml(
  webview: vscode.Webview,
  options: {
    activeView: WorkspaceView;
    refreshState: 'idle' | 'loading' | 'success' | 'error';
  },
): string {
  const nonce = createNonce();
  const viewLabel = WORKSPACE_VIEW_TITLES[options.activeView];
  const refreshLabel =
    options.refreshState === 'loading'
      ? 'Refreshing...'
      : options.refreshState === 'success'
        ? 'Refresh complete'
        : options.refreshState === 'error'
          ? 'Refresh failed'
          : 'Refresh';
  const buttons = WORKSPACE_NAVIGATION_ITEMS.map((item) => {
    const isView = item.kind === 'view';
    const isActive = isView && item.id === options.activeView;
    const stateClass =
      item.id === 'refresh' ? ` nav-item-refresh-${options.refreshState}` : '';
    const action = isView ? `openView:${item.id}` : 'refresh';
    const label =
      item.id === 'refresh' ? refreshLabel : item.label;
    return `<button
      class="nav-item${isActive ? ' is-active' : ''}${stateClass}"
      type="button"
      data-action="${action}"
      aria-label="${escapeHtml(label)}"
      title="${escapeHtml(label)}"
    >
      <span class="nav-item-icon" aria-hidden="true">${escapeHtml(item.icon)}</span>
      <span class="nav-item-label">${escapeHtml(item.label)}</span>
    </button>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      http-equiv="Content-Security-Policy"
      content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';"
    />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Budio Workspace Menu</title>
    <style>
      :root {
        color-scheme: dark;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        min-height: 100%;
        background: var(--vscode-sideBar-background);
        color: var(--vscode-sideBar-foreground);
        font-family: var(--vscode-font-family);
      }

      body {
        padding: 10px 8px 12px;
      }

      .menu-shell {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .menu-meta {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 4px 6px 8px;
      }

      .menu-eyebrow {
        color: var(--vscode-descriptionForeground);
        font-size: 10px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .menu-title {
        font-size: 12px;
        font-weight: 600;
        color: var(--vscode-sideBarTitle-foreground, var(--vscode-sideBar-foreground));
      }

      .nav-list {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .nav-item {
        width: 100%;
        border: 1px solid transparent;
        border-radius: 999px;
        background: transparent;
        color: inherit;
        display: grid;
        grid-template-columns: 18px minmax(0, 1fr);
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        text-align: left;
        cursor: pointer;
      }

      .nav-item:hover {
        background: var(--vscode-list-hoverBackground);
      }

      .nav-item:focus-visible {
        outline: 1px solid var(--vscode-focusBorder);
        outline-offset: 1px;
      }

      .nav-item.is-active {
        background: var(--vscode-list-activeSelectionBackground);
        color: var(--vscode-list-activeSelectionForeground);
        border-color: var(--vscode-list-activeSelectionBackground);
      }

      .nav-item-icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        line-height: 1;
      }

      .nav-item-label {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 12px;
      }

      .nav-item-refresh-loading {
        opacity: 0.82;
      }

      .nav-item-refresh-success {
        border-color: color-mix(in srgb, var(--vscode-testing-iconPassed, #89d185) 40%, transparent);
        background: color-mix(in srgb, var(--vscode-testing-iconPassed, #89d185) 12%, transparent);
      }

      .nav-item-refresh-error {
        border-color: color-mix(in srgb, var(--vscode-testing-iconFailed, #ff8b8b) 40%, transparent);
        background: color-mix(in srgb, var(--vscode-testing-iconFailed, #ff8b8b) 10%, transparent);
      }
    </style>
  </head>
  <body>
    <div class="menu-shell">
      <div class="menu-meta">
        <span class="menu-eyebrow">Budio Workspace</span>
        <span class="menu-title">${escapeHtml(viewLabel)}</span>
      </div>
      <div class="nav-list">
        ${buttons}
      </div>
    </div>
    <script nonce="${nonce}">
      const vscode = acquireVsCodeApi();
      document.addEventListener('click', (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) {
          return;
        }
        const button = target.closest('[data-action]');
        if (!(button instanceof HTMLElement)) {
          return;
        }
        const action = button.dataset.action;
        if (!action) {
          return;
        }
        if (action === 'refresh') {
          vscode.postMessage({ type: 'refresh' });
          return;
        }
        if (action.startsWith('openView:')) {
          vscode.postMessage({ type: 'openView', view: action.replace('openView:', '') });
        }
      });
    </script>
  </body>
</html>`;
}
