import { Task } from "src/types/task";
import { TaskStatus, TASK_LIST_KEY } from "src/constants/task";

import { getNonce } from "./getNonce";
import { getDataFromGlobalState, storeDataToGlobalState } from "./globalState";

export function getTaskList() {
  return getDataFromGlobalState<Task[]>(TASK_LIST_KEY) || [];
}

export async function updateTaskList(taskList: Task[]) {
  return storeDataToGlobalState(TASK_LIST_KEY, taskList);
}

export async function addTask(content: string) {
  const taskList = getTaskList();
  const newTask = {
    id: getNonce(),
    content,
    status: TaskStatus.Todo,
  };
  taskList.push(newTask);

  await updateTaskList(taskList);

  return taskList;
}

export async function removeTask(data: Task) {
  const taskList = getTaskList();
  const filteredList = [...taskList].filter((item) => item.id !== data.id);

  await updateTaskList(filteredList);

  return filteredList;
}

export async function doneTask(data: Task) {
  const taskList = getTaskList();
  const newTaskList = taskList.map((item) => {
    if (item.id === data.id) {
      return {
        ...item,
        status: TaskStatus.Done,
      };
    } else {
      return item;
    }
  });

  await updateTaskList(newTaskList);

  return newTaskList;
}

export async function undoTask(data: Task) {
  const taskList = getTaskList();
  const newTaskList = taskList.map((item) => {
    if (item.id === data.id) {
      return {
        ...item,
        status: TaskStatus.Todo,
      };
    } else {
      return item;
    }
  });

  await updateTaskList(newTaskList);

  return newTaskList;
}

export async function clearDoneTasks() {
  const taskList = getTaskList();
  const filteredList = [...taskList].filter(
    (item) => item.status !== TaskStatus.Done
  );

  await updateTaskList(filteredList);

  return filteredList;
}
