import * as vscode from 'vscode';

export class LauncherViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.options = {
      enableCommandUris: true,
      localResourceRoots: [this.extensionUri],
    };
    webviewView.webview.html = `<!DOCTYPE html>
<html lang="en">
  <body style="padding: 12px; color: var(--vscode-foreground); font-family: var(--vscode-font-family);">
    <div style="display:flex; flex-direction:column; gap:12px;">
      <div>
        <div style="font-size: 14px; font-weight: 600;">Budio Workspace</div>
        <div style="font-size: 12px; opacity: 0.7;">Local board bovenop markdown taken.</div>
      </div>
      <a href="command:budioWorkspace.openBoard" style="text-decoration:none;">Open board</a>
      <a href="command:budioWorkspace.openListView" style="text-decoration:none;">Open lijst</a>
      <a href="command:budioWorkspace.openSettings" style="text-decoration:none;">Open settings</a>
      <a href="command:budioWorkspace.refreshBoard" style="text-decoration:none;">Refresh / rescan</a>
      <a href="command:budioWorkspace.newTask" style="text-decoration:none;">Nieuwe taak</a>
    </div>
  </body>
</html>`;
  }
}
