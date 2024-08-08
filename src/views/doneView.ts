import * as vscode from "vscode";

import { ViewType } from "src/constants";
import {
  getWebviewOptions,
  setWebview,
  getWebview,
  getHtmlForWebview,
} from "src/utils";

class DoneViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public static readonly viewType = ViewType.doneView;

  private _webview?: vscode.Webview;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._webview = webviewView.webview;

    setWebview(ViewType.doneView, webviewView.webview);

    webviewView.webview.options = getWebviewOptions(this._extensionUri);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case "undoTask": {
          this._toUndoTask(data.data);
          break;
        }
      }
    });

    webviewView.webview.html = getHtmlForWebview(
      webviewView.webview,
      this._extensionUri,
      ViewType.doneView
    );
  }

  public clearDoneList() {
    this._webview?.postMessage({
      type: "clearDoneList",
    });
  }

  private _toUndoTask(data: { id: string; content: string }) {
    const toDoListView = getWebview(ViewType.toDoListView);
    if (toDoListView) {
      toDoListView.postMessage({
        type: "addTask",
        data,
      });
    }
  }
}

export default DoneViewProvider;
