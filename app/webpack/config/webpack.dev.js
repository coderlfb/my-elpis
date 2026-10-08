const baseConfig = require("./webpack.base.js");
const merge = require("webpack-merge");
const webpack = require("webpack");
const path = require("path");

// devServer的配置
const DEV_SERVER_CONFIG = {
  HOST: "127.0.0.1",
  PORT: 9002,
  HMR_PATH: "__webpack_hmr", // 官方规定
  TIMEOUT: 20000,
};
const { HOST, PORT, HMR_PATH, TIMEOUT } = DEV_SERVER_CONFIG;

// 开发阶段的 entry 配置需要加入 hmr
Object.keys(baseConfig.entry).forEach((key) => {
  // 第三方包不作为hmr入口
  if (key !== "vendor") {
    baseConfig.entry[key] = [
      // 主入口文件
      baseConfig.entry[key],
      // hmr 更新入口，官方指定的 hmr 路径
      `webpack-hot-middleware/client?path=http://${HOST}:${PORT}/${HMR_PATH}&timeout=${TIMEOUT}&reload=true`,
    ];
  }
});

// 开发环境webpack配置
const webpackConfig = merge.smart(baseConfig, {
  mode: "development", // 指定开发环境
  // sourceMap 开发工具，呈现代码的映射关系，便于在开发过程中调试代码
  devtool: "eval-cheap-module-source-map",
  // 开发环境的output配置
  output: {
    filename: "js/[name]_[chunkhash:8].js",
    path: path.resolve(process.cwd(), "./app/public/dist/dev/"), // 输出文件存储路径
    publicPath: `http://${HOST}:${PORT}/public/dist/dev/`, // 外部资源公共路径
    globalObject: "this", // 全局变量
  },
  // 开发阶段插件
  plugins: [
    // 模块热替换允许在应用程序运行时替换，提高开发效率
    new webpack.HotModuleReplacementPlugin({
      multiStep: false,
    }), // 热更新插件
  ],
});

module.exports = {
  webpackConfig,
  // devServer 配置，给dev.js 使用
  DEV_SERVER_CONFIG,
};
