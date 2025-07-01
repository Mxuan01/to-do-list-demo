import React, { useEffect } from "react";
import { ConfigProvider, Avatar } from "antd";
import { CheckCircleFilled, ExclamationCircleFilled } from "@ant-design/icons";

import {
  LOGIN_ERROR_MSG_MAP,
  LOGIN_ERROR_DESCRIPTION_MAP,
} from "webview/constants";
import logo from "webview/assets/logo.png";

import style from "./LoginCallback.module.less";

export const LoginCallback = () => {
  const errorCode = window.loginErrorCode;
  const success = !errorCode;

  // useEffect(() => {
  //   if (window.windowId) {
  //     window.open(
  //       "vscode://you-you.to-do-list-demo?windowId=" +
  //         window.windowId,
  //       "_self"
  //     );
  //   }
  // }, []);

  return (
    <ConfigProvider>
      <div className={style("login-callback")}>
        <div className={style("main-content")}>
          <div className={style("title")}>
            <Avatar size={32} src={logo} />
            <span>To-Do List Demo</span>
          </div>
          <div
            className={style("icon-container", { success, warning: !success })}
          >
            {success ? <CheckCircleFilled /> : <ExclamationCircleFilled />}
          </div>
          <div className={style("msg")}>
            {success ? "登录成功" : LOGIN_ERROR_MSG_MAP[errorCode]}
          </div>
          <div className={style("description")}>
            {success
              ? "可返回 IDE 客户端体验。"
              : LOGIN_ERROR_DESCRIPTION_MAP[errorCode]}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};
