import * as vscode from 'vscode';

export function createTaskWatcher(
  workspaceFolder: vscode.WorkspaceFolder,
  rootsRelative: string[],
  onChange: () => void,
): vscode.Disposable {
  const watchers = rootsRelative.map((rootRelative) =>
    vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(workspaceFolder, `${rootRelative}/**/*.md`),
    ),
  );
  let timer: NodeJS.Timeout | undefined;

  const schedule = () => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      onChange();
    }, 200);
  };

  for (const watcher of watchers) {
    watcher.onDidChange(schedule);
    watcher.onDidCreate(schedule);
    watcher.onDidDelete(schedule);
  }

  return new vscode.Disposable(() => {
    if (timer) {
      clearTimeout(timer);
    }
    watchers.forEach((watcher) => watcher.dispose());
  });
}
