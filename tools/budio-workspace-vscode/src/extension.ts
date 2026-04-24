import * as vscode from 'vscode';
import { BoardPanelController } from './extension/host/BoardPanelController';

export function activate(context: vscode.ExtensionContext): void {
  const controller = new BoardPanelController(context.extensionUri);

  context.subscriptions.push(
    controller,
    vscode.window.registerWebviewViewProvider('budioWorkspace.activityEntry', {
      resolveWebviewView(webviewView) {
        void controller.open('list');
        webviewView.webview.options = {
          enableCommandUris: true,
          localResourceRoots: [context.extensionUri],
        };
        webviewView.webview.html = `<!DOCTYPE html>
<html lang="en">
  <body style="margin:0; padding:0; background: transparent;"></body>
</html>`;
      },
    }),
    vscode.commands.registerCommand('budioWorkspace.openBoard', () => controller.open('board')),
    vscode.commands.registerCommand('budioWorkspace.openListView', () => controller.open('list')),
    vscode.commands.registerCommand('budioWorkspace.openSettings', () => controller.open('settings')),
    vscode.commands.registerCommand('budioWorkspace.refreshBoard', () => controller.refresh()),
    vscode.commands.registerCommand('budioWorkspace.newTask', () => controller.createTask()),
  );
}

export function deactivate(): void {}
