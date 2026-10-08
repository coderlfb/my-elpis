const webpack = require("webpack");
const webpackProdConfig = require("./config/webpack.prod.js");

console.log("\nbuilding...");

webpack(webpackProdConfig, (err, stats) => {
  if (err) {
    console.log(err);
    return;
  }
  process.stdout.write(
    `${stats.toString({
      colors: true, // 在控制台输出色彩信息
      modules: false, // 不显示每个模块的打包信息
      children: false, // 不显示子依赖的打包信息
      chunks: false, // 不显示每个代码的块信息
      chunkModules: true, // 显示代码块中模块的信息
    })}`
  );
});
