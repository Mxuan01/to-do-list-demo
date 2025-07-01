import { LoginErrorCode } from "../../src/constants/login";

export const LOGIN_ERROR_MSG_MAP: Record<string, string> = {
  [LoginErrorCode.INVALID_PARAM]: "无效参数",
  [LoginErrorCode.FETCH_USER_INFO_ERROR]: "登录失败",
};

export const LOGIN_ERROR_DESCRIPTION_MAP: Record<string, string> = {
  [LoginErrorCode.INVALID_PARAM]: "可返回 IDE 客户端重新登录。",
  [LoginErrorCode.FETCH_USER_INFO_ERROR]: "可返回 IDE 客户端重新登录。",
};

export { LoginErrorCode };
