import React, { useState, useEffect } from "react";
import type { FunctionComponent } from "react";
import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { CloseCircleOutlined } from "@ant-design/icons";

import type { Task } from "webview/types/task";
import {
  TASKS_UPDATE,
  TASK_DONE,
  REMOVE_TASK,
  WEBVIEW_DOM_READY,
} from "webview/constants";
import { getVsCodeApi } from "webview/utils";

import style from "webview/styles/Task.module.less";

const vscode = getVsCodeApi();

export const ToDoList: FunctionComponent = () => {
  const [taskList, setTaskList] = useState<Task[]>([]);

  function toRemoveTask(task: Task) {
    vscode.postMessage({ type: REMOVE_TASK, data: task });
  }

  function doneTask(task: Task) {
    vscode.postMessage({ type: TASK_DONE, data: task });
  }

  useEffect(() => {
    function onReceiveMessage(event: MessageEvent<any>) {
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
            className={style("task-item", "task-item-high-contrast")}
            key={task.id}
          >
            <VSCodeCheckbox onChange={() => doneTask(task)}>
              {task.content}
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
