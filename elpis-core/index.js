const Koa = require("koa");
const path = require("path");
const { sep } = path; // 兼容不同操作系统上的斜杠
const env = require("./env");
const middlewareLoader = require("./loader/middleware");
const routerSchemaLoader = require("./loader/router-schema");
const routerLoader = require("./loader/router");
const controllerLoader = require("./loader/controller");
const serviceLoader = require("./loader/service");
const configLoader = require("./loader/config");
const extendLoader = require("./loader/extend");

module.exports = {
  /**
   * 启动项目
   * @param {*} options 项目配置
     options = {
        name: "", // 项目名称
        homePath：“”, // 
     }
   */
  start(options = {}) {
    // koa实例
    const app = new Koa();
    // 应用配置
    app.options = options;
    // 基础路径
    app.baseDir = process.cwd();
    // 业务文件路径
    app.businessPath = path.resolve(app.baseDir, `.${sep}app`);
    // 初始化环境配置
    app.env = env();
    console.log(`--- [start] env: ${app.env.get()} ---`);

    // 加载middleware
    middlewareLoader(app);
    console.log(`--- [start] load middleware done ---`);

    // 加载routerschema
    routerSchemaLoader(app);
    console.log(`--- [start] load routerschema done ---`);

    // 加载controller
    controllerLoader(app);
    console.log(`--- [start] load controller done ---`);

    // 加载service
    serviceLoader(app);
    console.log(`--- [start] load service done ---`);

    // 加载config
    configLoader(app);
    console.log(`--- [start] load config done ---`);

    // 加载extend
    extendLoader(app);
    console.log(`--- [start] load extend done ---`);

    // 注册全局中间件
    try {
      require(`${app.businessPath}${sep}middleware.js`)(app);
      console.log(`--- [start] load global middleware done ---`);
    } catch (error) {
      console.log(error);

      console.log("[exception] global middleware file is not found");
    }

    // 注册路由
    routerLoader(app);
    console.log(`--- [start] load router done ---`);

    try {
      // 启动服务
      const post = process.env.PORT || 8080;
      const host = process.env.IP || "0.0.0.0";
      app.listen(post, host);
      console.log(`server is running at http://${host}:${post}`);
    } catch (error) {
      console.error(error);
    }
  },
};
