import * as vscode from "vscode";

import { ViewType, NODE_ENV_PROD } from "src/constants";
import { getUri, getNonce } from "src/utils";

const localServer = "http://localhost:8192";

export function getWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  viewType: ViewType
) {
  let styleUri = null;
  let scriptUri = null;
  const isProduction = process.env.NODE_ENV === NODE_ENV_PROD;

  if (isProduction) {
    styleUri = getUri(webview, extensionUri, ["dist", `${viewType}.css`]);
    scriptUri = getUri(webview, extensionUri, ["dist", `${viewType}.js`]);
  } else {
    styleUri = `${localServer}/${viewType}.css`;
    scriptUri = `${localServer}/${viewType}.js`;
  }

  // Use a nonce to only allow a specific script to be run.
  const nonce = getNonce();

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">

        <!-- Use a content security policy to only allow loading styles from our extension directory, and only allow scripts that have a specific nonce. (See the 'webview-sample' extension sample for img-src content security policy examples) -->
        <meta
          http-equiv="Content-Security-Policy"
          content="
            default-src 'none';
            style-src 'unsafe-inline' ${webview.cspSource} ${localServer};
            script-src 'nonce-${nonce}' ${localServer};
            connect-src ws://0.0.0.0:8192/ws ${localServer};
            img-src https: ${webview.cspSource} ${localServer};
          ">
  
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="${styleUri}" rel="stylesheet">
      
        <title>To-Do List Demo</title>
      </head>
      <body>
        <div id="root"></div>

        <script nonce="${nonce}" src="${scriptUri}"></script>
      </body>
    </html>
  `;
}
