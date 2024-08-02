import * as vscode from "vscode";

import { ViewType } from "src/constants";
import { getNonce } from "src/utils/getNonce";
import { getWebviewOptions } from "src/utils/getWebviewOptions";
import { setWebview, getWebview } from "src/utils/webviewCache";

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

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
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

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to the script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "js", "addTask.js")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<title>To Do List Demo</title>
			</head>
			<body>
				<div>
					<input placeholder='添加任务' id='addTaskInput' />
				</div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>
		`;
  }
}

export default AddTaskViewProvider;
