import * as url from "url";
import * as http from "http";

import Axios from "src/service";
import { getNonce, refreshUsername } from "src/utils";
import { CLIENT_ID, CLIENT_SECRET } from "src/constants/oauth";

type HttpReq = http.IncomingMessage;

type HttpRes = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage;
};

const DEFAULT_LOGIN_SERVER_PORT = 53225;

let _state = "";

class LoginServer {
  private _server: http.Server | null = null;

  private _port: number = DEFAULT_LOGIN_SERVER_PORT;

  private _isRunning: boolean = false;

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
      console.error("login server error ========>", err);
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
    } else {
      this._handle404(res);
    }
  }

  // 处理登录回调
  private async _handleLoginCallback(reqUrl: string, res: HttpRes) {
    const { code, state } = url.parse(reqUrl, true).query;

    // 校验 state，防止 CSRF
    if (state !== _state) {
      res.writeHead(200, {
        "Content-Type": "text/plain; charset=utf-8",
      });
      return res.end("非法请求：参数已失效");
    }

    // 重置 _state
    _state = "";

    if (!code) {
      return this._handleLoginError(res);
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
      return this._handleLoginError(res);
    }

    // 用 access_token 获取用户信息
    const userRes = await Axios.get("https://api.github.com/user", {
      headers: {
        Accept: "application/json",
        Authorization: `token ${access_token}`,
      },
    });
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    refreshUsername(userRes.data.name);
    return res.end("登录成功，可前往 IDE 客户端继续体验。");
  }

  // 登录失败
  private _handleLoginError(res: HttpRes) {
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    return res.end("登录失败：请稍后重试");
  }

  // 处理 404
  private _handle404(res: HttpRes) {
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
    });
    res.end("404 not found");
  }
}

let _loginServer: LoginServer | undefined;

export function getLoginServer() {
  if (!_loginServer) {
    _loginServer = new LoginServer();
  }
  return _loginServer;
}

function newState() {
  _state = getNonce();
  return _state;
}

export function getLoginUrl() {
  const state = newState();
  return `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=http://localhost:${DEFAULT_LOGIN_SERVER_PORT}/login/callback&state=${state}&scope=read:user%20user:email`;
}
