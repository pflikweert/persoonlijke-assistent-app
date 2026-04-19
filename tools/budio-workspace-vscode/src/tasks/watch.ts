import * as vscode from 'vscode';

export function createTaskWatcher(
  workspaceFolder: vscode.WorkspaceFolder,
  tasksRootRelative: string,
  onChange: () => void,
): vscode.Disposable {
  const pattern = new vscode.RelativePattern(workspaceFolder, `${tasksRootRelative}/**/*.md`);
  const watcher = vscode.workspace.createFileSystemWatcher(pattern);
  let timer: NodeJS.Timeout | undefined;

  const schedule = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      onChange();
    }, 200);
  };

  watcher.onDidChange(schedule);
  watcher.onDidCreate(schedule);
  watcher.onDidDelete(schedule);

  return new vscode.Disposable(() => {
    if (timer) {
      clearTimeout(timer);
    }
    watcher.dispose();
  });
}
