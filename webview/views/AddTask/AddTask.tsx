import React, { useState } from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import { getVsCodeApi } from "webview/utils";

import style from "./AddTask.module.less";

const vscode = getVsCodeApi();

export const AddTask = () => {
  const [taskContent, setTaskContent] = useState("");

  function onTaskContentChange(e: any) {
    setTaskContent(e.target.value);
  }

  const toAddTask: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    const task = taskContent.trim();
    if (e.key === "Enter" && task) {
      vscode.postMessage({ type: "addTask", content: task });
      setTaskContent("");
    }
  };

  return (
    <div className={style("add-task")}>
      <VSCodeTextField
        className={style("add-task-input")}
        placeholder="请输入待办项"
        value={taskContent}
        onKeyUp={toAddTask}
        onChange={onTaskContentChange}
      />
    </div>
  );
};
