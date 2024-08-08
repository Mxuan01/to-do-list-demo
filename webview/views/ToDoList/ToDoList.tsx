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

export const ToDoList: FunctionComponent = () => {
  const [taskList, setTaskList] = useState<Task[]>(vscodeState.taskList || []);

  function toRemoveTask(task: Task) {
    const filteredList = [...taskList].filter((item) => item.id !== task.id);
    setTaskList(filteredList);
  }

  function doneTask(task: Task) {
    toRemoveTask(task);
    vscode.postMessage({ type: "doneTask", data: task });
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
          <div className={style("task-item")} key={task.id}>
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
