import { NODE_ENV_PROD, LOGIN_CALLBACK } from "src/constants";

const localServer = "http://localhost:8192";

export function getLoginCallbackHtml(errorCode?: string) {
  let styleUri = null;
  let scriptUri = null;
  const isProduction = process.env.NODE_ENV === NODE_ENV_PROD;

  if (isProduction) {
    styleUri = `/static/${LOGIN_CALLBACK}.css`;
    scriptUri = `/static/${LOGIN_CALLBACK}.js`;
  } else {
    styleUri = `${localServer}/${LOGIN_CALLBACK}.css`;
    scriptUri = `${localServer}/${LOGIN_CALLBACK}.js`;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <link rel="icon" href="/static/logo.png" />
  
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <link href="${styleUri}" rel="stylesheet">
      
        <title>To-Do List Demo</title>
      </head>
      <body>
        <div id="root"></div>

        <script>
          window.loginErrorCode = ${errorCode ? `'${errorCode}'` : undefined};
        </script>
        <script src="${scriptUri}"></script>
      </body>
    </html>
  `;
}
