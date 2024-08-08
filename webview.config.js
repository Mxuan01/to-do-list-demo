// @ts-check
"use strict";

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const resolveApp = (relativePath) => path.resolve(__dirname, relativePath);

const webviewConfig = [
  {
    name: "webview",
    target: "web",
    entry: {
      addTaskView: resolveApp("webview/views/AddTask"),
      toDoListView: resolveApp("webview/views/ToDoList"),
      doneView: resolveApp("webview/views/DoneList"),
    },
    output: {
      filename: "[name].js",
      path: resolveApp("dist"),
    },
    devtool: "source-map",
    resolve: {
      extensions: [".ts", ".js", ".tsx", ".jsx"],
      alias: {
        webview: resolveApp("webview"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "ts-loader",
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            "@ecomfe/class-names-loader",
            MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
          ],
        },
        {
          test: /\.less$/,
          exclude: /\.module\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                defaultExport: true,
              },
            },
            "css-loader",
            "postcss-loader",
            {
              loader: "less-loader",
              options: {
                sourceMap: true,
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
        {
          test: /\.module\.less$/,
          use: [
            "@ecomfe/class-names-loader",
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                defaultExport: true,
              },
            },
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[local]_[hash:base64:5]", // 定义类名生成规则
                },
              },
            },
            "postcss-loader",
            {
              loader: "less-loader",
              options: {
                sourceMap: true,
                lessOptions: {
                  javascriptEnabled: true,
                },
              },
            },
          ],
        },
      ],
    },
    performance: {
      hints: false,
    },
    optimization: {
      minimizer: [
        // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`）
        `...`,
        new CssMinimizerPlugin(),
      ],
    },
    plugins: [new MiniCssExtractPlugin()],
    devServer: {
      compress: true,
      hot: true,
      allowedHosts: "all",
      port: 8192,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  },
];

module.exports = [webviewConfig];
