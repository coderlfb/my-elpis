const path = require("path");
const { sep } = path;
const glob = require("glob");

/**
 * middleware loader
 * @param {object} app Koa 实例
 * 加载所有 middleware，可通过‘app.middleware.${目录}.${文件}’ 访问
 * 例子：
     app/middleware
       |
       | -- custom-module
                |
                | -- custom-middleware.js
    => app.middleware.customModule.customMiddleware
 */
module.exports = (app) => {
  // 读取 app/middleware/**/**.js 目录下所有文件
  const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);
  const fileList = glob.sync(
    path.resolve(middlewarePath, `.${sep}**${sep}**.js`)
  );
  // 遍历所有文件，把内容加载到 app.middleware 中
  const middlewares = {};
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file);
    // 截取路径
    name = name.substring(
      name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,
      name.lastIndexOf(".")
    );
    // 把”-“统一改成驼峰式
    name = name.replace(/[_-][a-z]/gi, (str) => str.substring(1).toUpperCase());
    // 挂载middleware到内存 app 对象中
    let tempMiddleware = middlewares;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < names.length; i++) {
      const newName = names[i];
      if (i === len - 1) {
        tempMiddleware[newName] = require(path.resolve(file))(app);
      } else {
        tempMiddleware[newName] = tempMiddleware[newName] || {};
        tempMiddleware = tempMiddleware[newName];
      }
    }
  });
  app.middlewares = middlewares;
};
