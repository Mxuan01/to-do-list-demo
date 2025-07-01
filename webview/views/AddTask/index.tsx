import * as React from "react";

import { getClientRoot } from "webview/utils";

import { AddTask } from "./AddTask";

const root = getClientRoot("root");
root.render(<AddTask />);

// Webpack HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
