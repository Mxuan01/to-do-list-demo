import React, { useState, useEffect } from "react";
import {
  VSCodeTextField,
  VSCodeButton,
} from "@vscode/webview-ui-toolkit/react";

import { getVsCodeApi } from "webview/utils";
import {
  ADD_TASK,
  ADD_TASK_SUCCESS,
  LOGIN,
  LOGIN_SUCCESS,
  WEBVIEW_DOM_READY,
} from "webview/constants";

import style from "./AddTask.module.less";

const vscode = getVsCodeApi();

export const AddTask = () => {
  const [username, setUsername] = useState();
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

  function toLogin() {
    vscode.postMessage({ type: LOGIN });
  }

  useEffect(() => {
    function onReceiveMessage(event: MessageEvent<any>) {
      const message = event.data;

      switch (message.type) {
        case LOGIN_SUCCESS:
          return setUsername(message.data);
        case ADD_TASK_SUCCESS:
          return setTaskContent("");
      }
    }

    window.addEventListener("message", onReceiveMessage);

    return () => {
      window.removeEventListener("message", onReceiveMessage);
    };
  }, []);

  useEffect(() => {
    vscode.postMessage({
      type: WEBVIEW_DOM_READY,
    });
  }, []);

  return (
    <div className={style("add-task")}>
      <div className={style("header")}>
        {username ? (
          <div>您好，{username}</div>
        ) : (
          <VSCodeButton style={{ width: "100%" }} onClick={toLogin}>
            登录示例
          </VSCodeButton>
        )}
      </div>
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
