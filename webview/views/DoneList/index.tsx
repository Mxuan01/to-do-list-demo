import * as React from "react";
import { createRoot } from "react-dom/client";

import { ViewType } from "webview/constants";

import { DoneList } from "./DoneList";

const container = document.querySelector(`#${ViewType.doneView}`)!;
const root = createRoot(container);
root.render(<DoneList />);

// Webpack HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
