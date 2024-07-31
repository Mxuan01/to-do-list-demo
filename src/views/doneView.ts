import * as vscode from "vscode";

import { ViewType } from "src/constants";

class DoneViewProvider implements vscode.WebviewViewProvider {
  constructor(private readonly _extensionUri: vscode.Uri) {}

  public static readonly viewType = ViewType.doneView;

  private _view?: vscode.WebviewView;

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    // webviewView.webview.options = getWebviewOptions(this._extensionUri);
    webviewView.webview.html = `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading styles from our extension directory,
					and only allow scripts that have a specific nonce.
					(See the 'webview-sample' extension sample for img-src content security policy examples)
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<title>To Do List Demo</title>
			</head>
			<body>
				<div>已完成任务列表</div>
			</body>
			</html>`;
  }
}

export default DoneViewProvider;
