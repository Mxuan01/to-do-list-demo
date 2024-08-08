declare module "*.less";

interface Window {
  vscode: any;
  acquireVsCodeApi: Function;
}

interface ImportMeta {
  readonly webpackHot: any;
}
