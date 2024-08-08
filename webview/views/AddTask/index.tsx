import * as React from "react";

import { ViewType } from "webview/constants";
import { getClientRoot } from "webview/utils";

import { AddTask } from "./AddTask";

const root = getClientRoot(ViewType.addTaskView);
root.render(<AddTask />);

// Webpack HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
