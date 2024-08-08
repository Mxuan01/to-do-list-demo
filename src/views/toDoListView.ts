import * as vscode from "vscode";

import { ViewType } from "src/constants";
import {
  getWebviewOptions,
  setWebview,
  getWebview,
  getHtmlForWebview,
} from "src/utils";

class ToDoListViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public static readonly viewType = ViewType.toDoListView;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    setWebview(ViewType.toDoListView, webviewView.webview);

    webviewView.webview.options = getWebviewOptions(this._extensionUri);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "doneTask": {
          this._toDoneTask(data.data);
          break;
        }
      }
    });

    webviewView.webview.html = getHtmlForWebview(
      webviewView.webview,
      this._extensionUri,
      ViewType.toDoListView
    );
  }

  private _toDoneTask(data: { id: string; content: string }) {
    const doneView = getWebview(ViewType.doneView);
    if (doneView) {
      doneView.postMessage({
        type: "addTask",
        data,
      });
    }
  }
}

export default ToDoListViewProvider;
