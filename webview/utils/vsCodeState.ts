import { getVsCodeApi } from "./getVsCodeApi";

const vscode = getVsCodeApi();

export function getVsCodeState() {
  return vscode.getState();
}

export function setVsCodeState(state: Record<string, any>) {
  return vscode.setState(state);
}
