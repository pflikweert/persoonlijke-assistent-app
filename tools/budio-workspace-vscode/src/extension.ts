import * as vscode from 'vscode';
import { BoardPanelController } from './extension/host/BoardPanelController';
import { LauncherViewProvider } from './extension/host/LauncherViewProvider';

export function activate(context: vscode.ExtensionContext): void {
  const controller = new BoardPanelController(context.extensionUri);
  const launcher = new LauncherViewProvider(context.extensionUri);

  context.subscriptions.push(
    controller,
    vscode.window.registerWebviewViewProvider('budioWorkspace.launcher', launcher),
    vscode.commands.registerCommand('budioWorkspace.openBoard', () => controller.open('board')),
    vscode.commands.registerCommand('budioWorkspace.openListView', () => controller.open('list')),
    vscode.commands.registerCommand('budioWorkspace.openSettings', () => controller.open('settings')),
    vscode.commands.registerCommand('budioWorkspace.refreshBoard', () => controller.refresh()),
    vscode.commands.registerCommand('budioWorkspace.newTask', () => controller.createTask()),
  );
}

export function deactivate(): void {}
