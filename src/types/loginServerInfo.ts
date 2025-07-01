import { LoginServerStatus } from "../constants/login";

export type LoginServerInfo = {
  port: number;
  status: LoginServerStatus;
};
