import * as vscode from "vscode";

import { EXTENSION_NAME } from "../constants";

export function showWarningMessage(msg: string) {
  vscode.window.showWarningMessage(`${EXTENSION_NAME}：${msg}`);
}

export function showInfoMessage(msg: string) {
  vscode.window.showInformationMessage(`${EXTENSION_NAME}：${msg}`);
}
