import { TaskStatus } from "../constants";

export type Task = {
  id: string;
  content: string;
  status: TaskStatus;
};
