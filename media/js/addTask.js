// @ts-check

// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
  // @ts-ignore
  const vscode = acquireVsCodeApi();

  function toAddTask(e) {
    // 按回车键后执行添加逻辑
    if (e.keyCode === 13) {
      vscode.postMessage({ type: "addTask", content: e.target.value });
    }
  }

  document
    .getElementById("addTaskInput")
    ?.addEventListener("keypress", toAddTask);
})();
