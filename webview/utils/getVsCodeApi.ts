/**
 * 由于一个 session 仅能调用一次 acquireVsCodeApi，故在此缓存处理。
 * 出于安全考虑，这里并没有将获取到的 vscode api 对象挂载在 window 下，以防止被其它第三方脚本获取使用。
 */

let vscode: any = null;

export function getVsCodeApi() {
  if (!vscode) {
    vscode = window.acquireVsCodeApi();
  }

  return vscode;
}
