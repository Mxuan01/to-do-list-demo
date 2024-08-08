import * as vscode from "vscode";

import { ViewType, NODE_ENV_PROD } from "src/constants";
import { getUri, getNonce } from "src/utils";

const WebviewInfoMap = {
  [ViewType.addTaskView]: {
    id: ViewType.addTaskView,
    title: "添加任务",
  },
  [ViewType.toDoListView]: {
    id: ViewType.toDoListView,
    title: "待办项",
  },
  [ViewType.doneView]: {
    id: ViewType.doneView,
    title: "已完成",
  },
};

export function getHtmlForWebview(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  viewType: ViewType
) {
  const { id, title } = WebviewInfoMap[viewType];
  let scriptUri = null;
  let styleUri = null;
  const isProduction = process.env.NODE_ENV === NODE_ENV_PROD;

  if (isProduction) {
    styleUri = getUri(webview, extensionUri, ["dist", `${viewType}.css`]);
    scriptUri = getUri(webview, extensionUri, ["dist", `${viewType}.js`]);
  } else {
    const localServerUrl = "http://localhost:8192";

    styleUri = `${localServerUrl}/${viewType}.css`;
    scriptUri = `${localServerUrl}/${viewType}.js`;
  }

  // Use a nonce to only allow a specific script to be run.
  const nonce = getNonce();

  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">

      <!--
        Use a content security policy to only allow loading styles from our extension directory,
        and only allow scripts that have a specific nonce.
        (See the 'webview-sample' extension sample for img-src content security policy examples)
      -->

      <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'nonce-${nonce}'; script-src 'nonce-${nonce}'; connect-src ws://0.0.0.0:8192/ws;">

      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <link nonce="${nonce}" href="${styleUri}" rel="stylesheet">
      
      <title>To Do List Demo: ${title}</title>
    </head>
    <body>
      <div id=${id}></div>

      <script nonce="${nonce}" src="${scriptUri}"></script>
    </body>
    </html>`;
}
