import "webview/styles/index.less";

import * as React from "react";

import { ViewType } from "webview/constants";
import { getClientRoot } from "webview/utils";

import { ToDoList } from "./ToDoList";

const root = getClientRoot(ViewType.toDoListView);
root.render(<ToDoList />);

// Webpack HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
