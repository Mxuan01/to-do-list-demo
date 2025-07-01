import * as fs from "fs";
import * as path from "path";

import { LOGIN_USER_INFO_KEY } from "src/constants/login";

import { refreshUsername } from "./refreshUsername";
import { getExtensionContext } from "./extensionContext";
import { getDataFromGlobalState, storeDataToGlobalState } from "./globalState";

function getUserInfoFilePath(): string {
  const context = getExtensionContext();
  const storageDir = context.globalStorageUri.fsPath;
  return path.join(storageDir, "userInfo.json");
}

export function createAndWatchUserInfoFile() {
  const context = getExtensionContext();
  const storageDir = context.globalStorageUri.fsPath;
  // 检测存储目录是否存在，不存在则创建
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
  // 检测用户信息文件是否存在，不存在则创建
  const userInfoFilePath = getUserInfoFilePath();
  if (!fs.existsSync(userInfoFilePath)) {
    fs.writeFileSync(userInfoFilePath, JSON.stringify({}));
  }

  // 监听用户信息文件的变化，同步信息到全局状态以及 webview 面板
  fs.watch(userInfoFilePath, (eventType) => {
    if (eventType === "change") {
      try {
        const data = fs.readFileSync(userInfoFilePath, "utf-8");
        const userInfo = JSON.parse(data);

        // 同步存储到全局状态中，方便读取
        updateUserInfoToGlobalState(userInfo);

        refreshUsername(userInfo?.name);
      } catch (error) {
        console.error("reading user info file error: ", error);
      }
    }
  });
}

export function upsertUserInfo(data: Record<string, any>) {
  const userInfoFilePath = getUserInfoFilePath();
  fs.writeFileSync(userInfoFilePath, JSON.stringify(data, null, 2));
}

export function getUserInfoFromGlobalState() {
  return getDataFromGlobalState<Record<string, any>>(LOGIN_USER_INFO_KEY) || {};
}

async function updateUserInfoToGlobalState(data: Record<string, any>) {
  await storeDataToGlobalState(LOGIN_USER_INFO_KEY, data);
}
