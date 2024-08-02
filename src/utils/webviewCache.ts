import * as vscode from "vscode";

import { ViewType } from "src/constants";

// 缓存各个视图的 webviewView 实例，供不同视图之间通讯使用
const webviewMap: Partial<Record<ViewType, vscode.Webview>> = {};

export function setWebview(viewType: ViewType, webview: vscode.Webview) {
  webviewMap[viewType] = webview;
}

export function getWebview(viewType: ViewType) {
  return webviewMap[viewType];
}
