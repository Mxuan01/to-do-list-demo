import * as vscode from "vscode";
import * as url from "url";
import * as http from "http";

import Axios from "src/service";
import {
  CLIENT_ID,
  CLIENT_SECRET,
  LOGIN_CALLBACK,
  LoginErrorCode,
} from "src/constants";

import { getState, newState, resetState } from "./state";
import { refreshUsername } from "./refreshUsername";
import { getLoginCallbackHtml } from "./getLoginCallbackHtml";
import { getWindowId } from "./getWindowId";

type HttpReq = http.IncomingMessage;

type HttpRes = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage;
};

const DEFAULT_LOGIN_SERVER_PORT = 53225;

class LoginServer {
  constructor(extensionUri: vscode.Uri) {
    this._extensionUri = extensionUri;
  }

  private _server: http.Server | null = null;

  private _port: number = DEFAULT_LOGIN_SERVER_PORT;

  private _isRunning: boolean = false;

  private _extensionUri: vscode.Uri;

  // 启动服务器
  public start() {
    if (this._isRunning) {
      return;
    }

    // 创建 HTTP 服务器
    this._server = http.createServer((req, res) => {
      this._handleRequest(req, res);
    });

    this._server.listen(this._port, () => {
      this._isRunning = true;
    });

    this._server.on("error", (err) => {
      this._isRunning = false;
      console.error(`登录服务器启动失败 ===========> ${err.message}`);
    });
  }

  // 停止服务器
  public stop() {
    if (!this._server || !this._isRunning) {
      return;
    }

    this._server.close();
    this._server = null;
    this._isRunning = false;
  }

  // 处理 HTTP 请求
  private _handleRequest(req: HttpReq, res: HttpRes) {
    const url = req.url;
    if (!url) {
      return;
    }

    // 路由处理
    if (url.startsWith("/login/callback")) {
      this._handleLoginCallback(url, res);
    } else if (url.startsWith(`/static/${LOGIN_CALLBACK}.css`)) {
      this._respondStaticFileContent({
        res,
        filePath: `/dist/${LOGIN_CALLBACK}.css`,
        contentType: "text/css; charset=utf-8",
      });
    } else if (url.startsWith(`/static/${LOGIN_CALLBACK}.js`)) {
      this._respondStaticFileContent({
        res,
        filePath: `/dist/${LOGIN_CALLBACK}.js`,
        contentType: "text/javascript; charset=utf-8",
      });
    } else if (url.startsWith(`/static/logo.png`)) {
      this._respondStaticFileContent({
        res,
        filePath: `/media/icon/logo.png`,
        contentType: "image/png",
      });
    } else {
      this._handle404(res);
    }
  }

  // 处理登录回调
  private async _handleLoginCallback(reqUrl: string, res: HttpRes) {
    const { code, state } = url.parse(reqUrl, true).query;
    const cachedState = getState();
    const windowId = await getWindowId();

    // 校验 state，防止 CSRF
    if (state !== cachedState) {
      return this._handleLoginError({
        res,
        errorCode: LoginErrorCode.INVALID_PARAM,
        windowId,
      });
    }

    // 立即重置 state
    await resetState();

    if (!code) {
      return this._handleLoginError({
        res,
        errorCode: LoginErrorCode.INVALID_PARAM,
        windowId,
      });
    }

    // 注意！！！这里仅为演示说明，实际业务中，一定要将该逻辑放在服务端，由服务端去请求 token
    const tokenRes = await Axios.post(
      "https://github.com/login/oauth/access_token",
      {
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const access_token = tokenRes.data.access_token;
    if (!access_token) {
      return this._handleLoginError({
        res,
        errorCode: LoginErrorCode.FETCH_USER_INFO_ERROR,
        windowId,
      });
    }

    // 用 access_token 获取用户信息
    const userRes = await Axios.get("https://api.github.com/user", {
      headers: {
        Accept: "application/json",
        Authorization: `token ${access_token}`,
      },
    });
    if (!userRes.data) {
      return this._handleLoginError({
        res,
        errorCode: LoginErrorCode.FETCH_USER_INFO_ERROR,
        windowId,
      });
    }

    refreshUsername(userRes.data.name);
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getLoginCallbackHtml({ windowId }));
  }

  // 登录失败
  private _handleLoginError({
    res,
    errorCode,
    windowId,
  }: {
    res: HttpRes;
    errorCode: LoginErrorCode;
    windowId: string;
  }) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(getLoginCallbackHtml({ errorCode, windowId }));
  }

  private async _respondStaticFileContent({
    res,
    filePath,
    contentType,
  }: {
    res: http.ServerResponse;
    filePath: string;
    contentType: string;
  }) {
    try {
      const fileUri = vscode.Uri.joinPath(this._extensionUri, filePath);
      const fileContent = await vscode.workspace.fs.readFile(fileUri);
      res.writeHead(200, {
        "Content-Type": contentType,
      });
      res.end(fileContent);
    } catch (err: any) {
      this._handle404(res, `404 资源未找到: ${err.message}`);
    }
  }

  // 处理 404
  private _handle404(res: HttpRes, msg: string = "404 not found") {
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    res.end(msg);
  }
}

let _loginServer: LoginServer | undefined;

export function createLoginServer(extensionUri: vscode.Uri) {
  if (!_loginServer) {
    _loginServer = new LoginServer(extensionUri);
  }
  return _loginServer;
}

export function getLoginServer() {
  return _loginServer;
}

export async function getLoginUrl() {
  const state = await newState();
  return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=http://localhost:${DEFAULT_LOGIN_SERVER_PORT}/login/callback&state=${state}&scope=read:user%20user:email`;
}
