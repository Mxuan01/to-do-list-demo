import * as vscode from "vscode";

import {
  ViewType,
  ADD_TASK,
  ADD_TASK_SUCCESS,
  LOGIN,
  WEBVIEW_DOM_READY,
} from "src/constants";
import {
  getWebviewOptions,
  getWebviewHtml,
  addTask,
  showWarningMessage,
  refreshToDoList,
  getLoginUrl,
  createLoginServer,
  refreshUsername,
} from "src/utils";

class AddTaskViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public static readonly viewType = ViewType.addTaskView;

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
      ViewType.addTaskView
    );

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case LOGIN: {
          this._handleLogin();
          break;
        }
        case ADD_TASK: {
          this._handleAddTask(data.content);
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
        refreshUsername();
      } else {
        this.webviewDomReady = false;
      }
    });

    refreshUsername();
  }

  private async _handleLogin() {
    try {
      const loginServer = createLoginServer(this._extensionUri);
      await loginServer.start();
      const loginUrl = await getLoginUrl();
      vscode.env.openExternal(vscode.Uri.parse(loginUrl));
    } catch (error) {
      console.error("登录异常：", error);
      showWarningMessage("登录异常，请稍后重试");
    }
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
