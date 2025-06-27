import { Task } from "src/types/task";
import { TaskStatus, TASKS_UPDATE } from "src/constants";
import {
  sleep,
  getTaskList,
  getToDoListViewProvider,
  getDoneViewProvider,
} from "src/utils";

export async function refreshToDoList(tasks?: Task[]) {
  const toDoListViewProvider = getToDoListViewProvider();
  while (!toDoListViewProvider?.webviewDomReady) {
    await sleep();
  }
  if (!tasks) {
    tasks = getTaskList();
  }
  toDoListViewProvider.webviewView?.webview.postMessage({
    type: TASKS_UPDATE,
    data: tasks.filter((item) => item.status === TaskStatus.Todo),
  });
}

export async function refreshDoneList(tasks?: Task[]) {
  const doneViewProvider = getDoneViewProvider();
  while (!doneViewProvider?.webviewDomReady) {
    await sleep();
  }
  if (!tasks) {
    tasks = getTaskList();
  }
  doneViewProvider.webviewView?.webview.postMessage({
    type: TASKS_UPDATE,
    data: tasks.filter((item) => item.status === TaskStatus.Done),
  });
}
