declare module "*.less";

interface Window {
  vscode: any;
  acquireVsCodeApi: Function;
  windowId?: string;
  loginErrorCode?: string;
}

interface ImportMeta {
  readonly webpackHot: any;
}

declare module "*.gif" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.jpeg" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "*.webp" {
  const src: string;
  export default src;
}
