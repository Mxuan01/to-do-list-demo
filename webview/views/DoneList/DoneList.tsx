import React, { useState, useEffect } from "react";
import type { FunctionComponent } from "react";
import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { CloseCircleOutlined } from "@ant-design/icons";

import { getVsCodeApi, getVsCodeState, setVsCodeState } from "webview/utils";

import style from "webview/styles/Task.module.less";

const vscode = getVsCodeApi();
const vscodeState = getVsCodeState() || {};

type Task = {
  id: string;
  content: string;
};

export const DoneList: FunctionComponent = () => {
  const [taskList, setTaskList] = useState<Task[]>(vscodeState.taskList || []);

  function toRemoveTask(task: Task) {
    const filteredList = [...taskList].filter((item) => item.id !== task.id);
    setTaskList(filteredList);
  }

  function undoTask(task: Task) {
    toRemoveTask(task);
    vscode.postMessage({ type: "undoTask", data: task });
  }

  function toUpdateDoneList(data: Task) {
    setTaskList((tasks) => tasks.concat(data));
  }

  function onReceiveMessage(event: MessageEvent<any>) {
    // The json data that the extension sent
    const message = event.data;

    switch (message.type) {
      case "addTask":
        return toUpdateDoneList(message.data);
      case "clearDoneList":
        return setTaskList([]);
    }
  }

  useEffect(() => {
    setVsCodeState({
      taskList,
    });
  }, [taskList]);

  useEffect(() => {
    window.addEventListener("message", onReceiveMessage);

    return () => {
      window.removeEventListener("message", onReceiveMessage);
    };
  }, [onReceiveMessage]);

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
