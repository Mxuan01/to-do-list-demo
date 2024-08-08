import * as React from "react";
import { createRoot } from "react-dom/client";

import { ViewType } from "webview/constants";

import { ToDoList } from "./ToDoList";

const container = document.querySelector(`#${ViewType.toDoListView}`)!;
const root = createRoot(container);
root.render(<ToDoList />);

// Webpack HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
