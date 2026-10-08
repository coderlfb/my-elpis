// 本地开发启动 devServer
const express = require("express");
const path = require("path");
const webpack = require("webpack");
const devMiddleware = require("webpack-dev-middleware");
const hotMiddleware = require("webpack-hot-middleware");
const consoler = require("consoler");

// 从webpack.dev.js获取配置
const { webpackConfig, DEV_SERVER_CONFIG } = require("./config/webpack.dev.js");

const app = express();
const compiler = webpack(webpackConfig);

// 指定静态文件目录
app.use(express.static(path.join(__dirname, "../public/dist")));

// 引用devMiddleware中间件（监控文件改动）
app.use(
  devMiddleware(compiler, {
    // 落地文件
    writeToDisk: (filePath) => filePath.endsWith(".tpl"),
    // 资源路径
    publicPath: webpackConfig.output.publicPath,
    // headers 配置
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
    stats: {
      colors: true,
    },
  })
);

// 引入hotMiddleware中间件（实现热更新通讯）
app.use(
  hotMiddleware(compiler, {
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: () => {},
  })
);

consoler("请等待webpack初次构建完成提示....");

// 启动 devServer
const port = DEV_SERVER_CONFIG.PORT;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
