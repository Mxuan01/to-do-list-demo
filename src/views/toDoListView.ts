import * as vscode from "vscode";

import { Task } from "src/types/task";
import {
  ViewType,
  TASK_DONE,
  REMOVE_TASK,
  WEBVIEW_DOM_READY,
} from "src/constants";
import {
  getWebviewOptions,
  getHtmlForWebview,
  refreshToDoList,
  refreshDoneList,
  showWarningMessage,
  removeTask,
  doneTask,
} from "src/utils";

class ToDoListViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public static readonly viewType = ViewType.toDoListView;

  public webviewView: vscode.WebviewView | undefined;

  public webviewDomReady = false;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.webviewView = webviewView;

    webviewView.webview.options = getWebviewOptions(this._extensionUri);

    webviewView.webview.html = getHtmlForWebview(
      webviewView.webview,
      this._extensionUri,
      ViewType.toDoListView
    );

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case TASK_DONE: {
          this._handleDoneTask(data.data);
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
        refreshToDoList();
      } else {
        this.webviewDomReady = false;
      }
    });

    refreshToDoList();
  }

  private async _handleRemoveTask(data: Task) {
    try {
      const taskList = await removeTask(data);

      refreshToDoList(taskList);
    } catch (error) {
      showWarningMessage("删除任务失败，请稍后重试");
    }
  }

  private async _handleDoneTask(data: Task) {
    try {
      const taskList = await doneTask(data);

      refreshToDoList(taskList);
      refreshDoneList(taskList);
    } catch (error) {
      showWarningMessage("更新任务状态失败，请稍后重试");
    }
  }
}

export default ToDoListViewProvider;
