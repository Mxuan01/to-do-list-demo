import { LOGIN_SUCCESS } from "src/constants";
import { getAddTaskViewProvider } from "src/utils";

export async function refreshUsername(username: string) {
  const addTaskViewProvider = getAddTaskViewProvider();
  addTaskViewProvider.webviewView?.webview.postMessage({
    type: LOGIN_SUCCESS,
    data: username,
  });
}
