import * as vscode from "vscode";

import { ViewType, ADD_TASK, ADD_TASK_SUCCESS } from "src/constants";
import {
  getWebviewOptions,
  getHtmlForWebview,
  addTask,
  showWarningMessage,
  refreshToDoList,
} from "src/utils";

class AddTaskViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public static readonly viewType = ViewType.addTaskView;

  public webviewView: vscode.WebviewView | undefined;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this.webviewView = webviewView;

    webviewView.webview.options = getWebviewOptions(this._extensionUri);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case ADD_TASK: {
          this._handleAddTask(data.content);
          break;
        }
      }
    });

    webviewView.webview.html = getHtmlForWebview(
      webviewView.webview,
      this._extensionUri,
      ViewType.addTaskView
    );
  }

  private async _handleAddTask(content: string) {
    try {
      const taskList = await addTask(content);

      refreshToDoList(taskList);

      this.webviewView?.webview?.postMessage({
        type: ADD_TASK_SUCCESS,
      });
    } catch (error) {
      showWarningMessage("添加任务失败，请稍后重试");
    }
  }
}

export default AddTaskViewProvider;
