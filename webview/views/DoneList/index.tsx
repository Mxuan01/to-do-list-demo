import "webview/styles/index.less";

import * as React from "react";
import { getClientRoot } from "webview/utils";

import { DoneList } from "./DoneList";

const root = getClientRoot("root");
root.render(<DoneList />);

// Webpack HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
