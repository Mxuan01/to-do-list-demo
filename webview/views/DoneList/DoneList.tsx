import React, { useState, useEffect } from "react";
import type { FunctionComponent } from "react";
import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { CloseCircleOutlined } from "@ant-design/icons";

import { getVsCodeApi } from "webview/utils";
import {
  TASKS_UPDATE,
  WEBVIEW_DOM_READY,
  TASK_UNDO,
  REMOVE_TASK,
} from "webview/constants";

import style from "webview/styles/Task.module.less";

const vscode = getVsCodeApi();

type Task = {
  id: string;
  content: string;
};

export const DoneList: FunctionComponent = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);

  function toRemoveTask(task: Task) {
    vscode.postMessage({ type: REMOVE_TASK, data: task });
  }

  function undoTask(task: Task) {
    vscode.postMessage({ type: TASK_UNDO, data: task });
  }

  useEffect(() => {
    function onReceiveMessage(event: MessageEvent<any>) {
      // The json data that the extension sent
      const message = event.data;

      switch (message.type) {
        case TASKS_UPDATE:
          return setTaskList(message.data);
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
    <div className={style("task-list")}>
      {taskList.map((task) => {
        return (
          <div
            className={style("task-item", "task-item-high-contrast", "done")}
            key={task.id}
          >
            <VSCodeCheckbox checked onChange={() => undoTask(task)}>
              <span className={style("task-content")}>{task.content}</span>
            </VSCodeCheckbox>
            <CloseCircleOutlined
              className={style("remove-icon")}
              onClick={() => toRemoveTask(task)}
            />
          </div>
        );
      })}
    </div>
  );
};
