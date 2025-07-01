import { getGlobalStateKey } from "../utils/getGlobalStateKey";

export enum LoginErrorCode {
  INVALID_PARAM = "INVALID_PARAM",
  FETCH_USER_INFO_ERROR = "FETCH_USER_INFO_ERROR",
}

export enum LoginServerStatus {
  RUNNING = "running",
  STOPPED = "stopped",
}

export const LOGIN_STATE_KEY = getGlobalStateKey("login_state");

export const LOGIN_SERVER_INFO_KEY = getGlobalStateKey("login_server_info");

export const LOGIN_USER_INFO_KEY = getGlobalStateKey("login_user_info");
