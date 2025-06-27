import AddTaskViewProvider from "../views/addTaskView";
import ToDoListViewProvider from "../views/toDoListView";
import DoneViewProvider from "../views/doneView";

let _addTaskViewProvider: AddTaskViewProvider;
export function getAddTaskViewProvider() {
  return _addTaskViewProvider;
}
export function setAddTaskViewProvider(provider: AddTaskViewProvider) {
  _addTaskViewProvider = provider;
}

let _toDoListViewProvider: ToDoListViewProvider;
export function getToDoListViewProvider() {
  return _toDoListViewProvider;
}
export function setToDoListViewProvider(provider: ToDoListViewProvider) {
  _toDoListViewProvider = provider;
}

let _doneViewProvider: DoneViewProvider;
export function getDoneViewProvider() {
  return _doneViewProvider;
}
export function setDoneViewProvider(provider: DoneViewProvider) {
  _doneViewProvider = provider;
}
