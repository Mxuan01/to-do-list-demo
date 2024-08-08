import React, { useState, useEffect } from "react";
import type { FunctionComponent } from "react";

import { getVsCodeApi, getVsCodeState, setVsCodeState } from "webview/utils";

import style from "./ToDoList.module.less";

const vscode = getVsCodeApi();
const vscodeState = getVsCodeState() || {};

type Task = {
  id: string;
  content: string;
};

export const ToDoList: FunctionComponent = () => {
  const [taskList, setTaskList] = useState<Task[]>(vscodeState.taskList || []);

  function doneTask(task: Task) {
    let doneTaskData;
    const filteredList = [...taskList].filter((item) => {
      const isDoneTask = item.id === task.id;
      if (isDoneTask) {
        doneTaskData = task;
      }
      return !isDoneTask;
    });
    setTaskList(filteredList);
    vscode.postMessage({ type: "doneTask", data: doneTaskData });
  }

  function toUpdateToDoList(data: string | Task) {
    const tasks = [...taskList];
    if (typeof data === "string") {
      tasks.push({ id: `${Date.now()}`, content: data });
    } else {
      tasks.push(data);
    }
    setTaskList(tasks);
  }

  function onReceiveMessage(event: MessageEvent<any>) {
    // The json data that the extension sent
    const message = event.data;

    switch (message.type) {
      case "addTask":
        return toUpdateToDoList(message.data);
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
            onClick={() => doneTask(task)}
          >
            {task.content}
          </div>
        );
      })}
    </div>
  );
};
