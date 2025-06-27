import React, { useState, useEffect } from "react";
import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import { getVsCodeApi } from "webview/utils";
import { ADD_TASK, ADD_TASK_SUCCESS } from "webview/constants";

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
      vscode.postMessage({ type: ADD_TASK, content: task });
    }
  };

  useEffect(() => {
    function onReceiveMessage(event: MessageEvent<any>) {
      const message = event.data;

      switch (message.type) {
        case ADD_TASK_SUCCESS:
          return setTaskContent("");
      }
    }

    window.addEventListener("message", onReceiveMessage);

    return () => {
      window.removeEventListener("message", onReceiveMessage);
    };
  }, []);

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
