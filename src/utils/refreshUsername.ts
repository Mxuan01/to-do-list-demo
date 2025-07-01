import { LOGIN_SUCCESS } from "src/constants";
import {
  sleep,
  getAddTaskViewProvider,
  getUserInfoFromGlobalState,
} from "src/utils";

export async function refreshUsername(username?: string) {
  const addTaskViewProvider = getAddTaskViewProvider();
  while (!addTaskViewProvider?.webviewDomReady) {
    await sleep();
  }

  if (!username) {
    username = getUserInfoFromGlobalState()?.name || "";
  }

  addTaskViewProvider.webviewView?.webview.postMessage({
    type: LOGIN_SUCCESS,
    data: username,
  });
}
