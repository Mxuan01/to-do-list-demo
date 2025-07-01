import * as vscode from "vscode";

import { Task } from "src/types/task";
import {
  ViewType,
  TASK_UNDO,
  REMOVE_TASK,
  WEBVIEW_DOM_READY,
} from "src/constants";
import {
  getWebviewOptions,
  getWebviewHtml,
  undoTask,
  removeTask,
  refreshToDoList,
  refreshDoneList,
  clearDoneTasks,
  showWarningMessage,
} from "src/utils";

class DoneViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public static readonly viewType = ViewType.doneView;

  public webviewDomReady = false;

  public webviewView: vscode.WebviewView | undefined;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.webviewView = webviewView;

    webviewView.webview.options = getWebviewOptions(this._extensionUri);

    webviewView.webview.html = getWebviewHtml(
      webviewView.webview,
      this._extensionUri,
      ViewType.doneView
    );

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case TASK_UNDO: {
          this._handleUndoTask(data.data);
          break;
        }
        case REMOVE_TASK: {
          this._handleRemoveTask(data.data);
          break;
        }
        case WEBVIEW_DOM_READY: {
          this.webviewDomReady = true;
          break;
        }
      }
    });

    webviewView.onDidChangeVisibility(async () => {
      if (webviewView.visible) {
        refreshDoneList();
      } else {
        this.webviewDomReady = false;
      }
    });

    refreshDoneList();
  }

  public async clearDoneList() {
    try {
      const taskList = await clearDoneTasks();
      refreshDoneList(taskList);
    } catch (error) {
      showWarningMessage("清除已完成任务失败，请稍后重试");
    }
  }

  private async _handleRemoveTask(data: Task) {
    try {
      const taskList = await removeTask(data);
      refreshDoneList(taskList);
    } catch (error) {
      showWarningMessage("删除任务失败，请稍后重试");
    }
  }

  private async _handleUndoTask(data: Task) {
    try {
      const taskList = await undoTask(data);

      refreshDoneList(taskList);
      refreshToDoList(taskList);
    } catch (error) {
      showWarningMessage("更新任务状态失败，请稍后重试");
    }
  }
}

export default DoneViewProvider;
