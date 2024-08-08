import React, { useState, useEffect } from "react";
import type { FunctionComponent } from "react";

import { getVsCodeApi, getVsCodeState, setVsCodeState } from "webview/utils";

import style from "./DoneList.module.less";

const vscode = getVsCodeApi();
const vscodeState = getVsCodeState() || {};

type Task = {
  id: string;
  content: string;
};

export const DoneList: FunctionComponent = () => {
  const [taskList, setTaskList] = useState<Task[]>(vscodeState.taskList || []);

  function undoTask(task: Task) {
    let undoTaskData;
    const filteredList = [...taskList].filter((item) => {
      const isUndoTask = item.id === task.id;
      if (isUndoTask) {
        undoTaskData = task;
      }
      return !isUndoTask;
    });
    setTaskList(filteredList);
    vscode.postMessage({ type: "undoTask", data: undoTaskData });
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
            className={style("task-item")}
            key={task.id}
            onClick={() => undoTask(task)}
          >
            {task.content}
          </div>
        );
      })}
    </div>
  );
};
