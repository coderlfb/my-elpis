const path = require("path");
const { sep } = path;
const glob = require("glob");

/**
 * router-schema loader
 * @param {object} app Koa实例
 * 通过 ‘json-schema & ajv‘ 对API规则进行约束，配合api-params-verify中间件使用
 * app/router-schema/**.js
      输出：
      app.routerSchema = {
        '${api1}': ${jsonSchema}
      }
 * 
 */

module.exports = (app) => {
  // 读取 app/controller/**/**.js 目录下所有文件
  const routerSchemaPath = path.resolve(
    app.businessPath,
    `.${sep}router-schema`
  );
  const fileList = glob.sync(
    path.resolve(routerSchemaPath, `.${sep}**${sep}**.js`)
  );
  // 注册所有 routerSchema,使得可以通过‘app.routerSchema’访问
  let routerSchema = {};
  fileList.forEach((file) => {
    routerSchema = {
      ...routerSchema,
      ...require(path.resolve(file)),
    };
  });
  app.routerSchema = routerSchema;
};
