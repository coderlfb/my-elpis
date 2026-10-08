const path = require("path");
const { sep } = path;
/**
 * config loader
 * @param {object} app koa实例
 * 配置区分 本地/测试/生产 通过 env 环境读取不同文件配置  env.config
 * 通过env.config覆盖default.config加载到app.config
 *
 * 目录下对应的config配置
 * 默认配置 config/config.default.js
 * 本地配置 config/config.local.js
 * 测试配置 config/config.beta.js
 * 生产配置 config/config.prod.js
 */
module.exports = (app) => {
  // 找到config/目录
  const configPath = path.resolve(app.baseDir, `.${sep}config`);
  //  获取到default.config
  let defaultConfig = {};
  try {
    defaultConfig = require(path.resolve(
      configPath,
      `.${sep}config.default.js`
    ));
  } catch (e) {
    console.error("[exception] config.default.js not found");
  }
  // 获取到env.config
  let envConfig = {};
  try {
    // 本地环境
    if (app.env.isLocal()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.local.js`));
    } else if (app.env.isBeta()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`));
    } else if (app.env.isProduction()) {
      envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`));
    }
  } catch (e) {
    console.error(`[exception] env.config.js not found or ${e}`);
  }
  // 覆盖并加载config配置
  app.config = Object.assign({}, defaultConfig, envConfig);
};
