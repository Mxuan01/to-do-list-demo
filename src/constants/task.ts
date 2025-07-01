import { getGlobalStateKey } from "../utils/getGlobalStateKey";

export const TASK_LIST_KEY = getGlobalStateKey("task_list");

export enum TaskStatus {
  Todo = "todo",
  Done = "done",
}
