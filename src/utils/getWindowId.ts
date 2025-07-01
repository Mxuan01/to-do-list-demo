import * as vscode from "vscode";
import { URLSearchParams } from "url";

export async function getWindowId() {
  const loginCallbackUri = await vscode.env.asExternalUri(
    vscode.Uri.parse(`${vscode.env.uriScheme}://you-you.to-do-list-demo`)
  );
  const queryParams = new URLSearchParams(loginCallbackUri.query);

  return queryParams.get("windowId") || "";
}
