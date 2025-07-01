import { LOGIN_STATE_KEY } from "src/constants/login";

import { getNonce } from "./getNonce";
import { getDataFromGlobalState, storeDataToGlobalState } from "./globalState";

export function getState() {
  return getDataFromGlobalState<string>(LOGIN_STATE_KEY) || "";
}

export async function newState() {
  const state = getNonce();
  await storeDataToGlobalState(LOGIN_STATE_KEY, state);
  return state;
}

export async function resetState() {
  await storeDataToGlobalState(LOGIN_STATE_KEY, "");
}
