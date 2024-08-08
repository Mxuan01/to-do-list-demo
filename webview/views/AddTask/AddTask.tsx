import * as React from "react";
import type { FunctionComponent } from "react";

import { getVsCodeApi } from "webview/utils";

const vscode = getVsCodeApi();

export const AddTask: FunctionComponent = () => {
  const toAddTask: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      // @ts-ignore
      vscode.postMessage({ type: "addTask", content: e.target.value });
    }
  };

  return <input onKeyUp={toAddTask} />;
};
