import * as vscode from 'vscode';

export class LauncherViewProvider implements vscode.WebviewViewProvider {
  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly openBoard: () => Promise<void>,
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    void this.openBoard();
    webviewView.webview.options = {
      enableCommandUris: true,
      localResourceRoots: [this.extensionUri],
    };
    webviewView.webview.html = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0; padding:0; background: transparent;"></body>
</html>`;
  }
}
