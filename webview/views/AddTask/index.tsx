import * as React from "react";
import { createRoot } from "react-dom/client";

import { ViewType } from "webview/constants";

import { AddTask } from "./AddTask";

const container = document.querySelector(`#${ViewType.addTaskView}`)!;
const root = createRoot(container);
root.render(<AddTask />);

// Webpack HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
