import * as vscode from "vscode";

import { ViewType } from "src/constants";
import {
  getWebviewOptions,
  setWebview,
  getWebview,
  getHtmlForWebview,
} from "src/utils";

class AddTaskViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public static readonly viewType = ViewType.addTaskView;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    setWebview(ViewType.addTaskView, webviewView.webview);

    webviewView.webview.options = getWebviewOptions(this._extensionUri);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "addTask": {
          this._toAddTask(data.content);
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

  private _toAddTask(data: string) {
    const toDoListView = getWebview(ViewType.toDoListView);
    if (toDoListView) {
      toDoListView.postMessage({
        type: "addTask",
        data,
      });
    }
  }
}

export default AddTaskViewProvider;
