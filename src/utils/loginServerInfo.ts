import { LOGIN_SERVER_INFO_KEY } from "src/constants/login";
import { LoginServerInfo } from "src/types/loginServerInfo";

import { getDataFromGlobalState, storeDataToGlobalState } from "./globalState";

export function getServerInfo() {
  return getDataFromGlobalState<LoginServerInfo>(LOGIN_SERVER_INFO_KEY);
}

export async function updateServerInfo(data: Partial<LoginServerInfo>) {
  const serverInfo = getServerInfo() || {};

  await storeDataToGlobalState(LOGIN_SERVER_INFO_KEY, {
    ...serverInfo,
    ...data,
  });
}

export async function clearServerInfo() {
  await storeDataToGlobalState(LOGIN_SERVER_INFO_KEY, {});
}
