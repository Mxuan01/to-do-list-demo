import * as React from "react";

import { getClientRoot } from "webview/utils/clientRoot";

import { LoginCallback } from "./LoginCallback";

const root = getClientRoot("root");
root.render(<LoginCallback />);

// Webpack HMR
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
}
