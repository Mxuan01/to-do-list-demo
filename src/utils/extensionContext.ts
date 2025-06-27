import * as vscode from "vscode";

let extensionContext: vscode.ExtensionContext;

export function getExtensionContext() {
  return extensionContext;
}

export function setExtensionContext(context: vscode.ExtensionContext) {
  extensionContext = context;
}
