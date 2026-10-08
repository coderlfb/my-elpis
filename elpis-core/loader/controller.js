const path = require("path");
const { sep } = path;
const glob = require("glob");
/**
 * controller loader
 * @param {object} app koa实例
 *  加载所有 controller ，通过app.controller.${目录}.${文件}’ 访问
 * 例子：
     app/controller
       |
       | -- custom-module
                |
                | -- custom-controller.js
    => app.controller.customModule.customController
 */

module.exports = (app) => {
  // 读取 app/controller/**/**.js 目录下所有文件
  const controllerPath = path.resolve(app.businessPath, `.${sep}controller`);
  const fileList = glob.sync(
    path.resolve(controllerPath, `.${sep}**${sep}**.js`)
  );
  // 遍历所有文件，把内容加载到 app.controller 中
  const controller = {};
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file);
    // 截取路径
    name = name.substring(
      name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,
      name.lastIndexOf(".")
    );
    // 把”-“统一改成驼峰式
    name = name.replace(/[_-][a-z]/gi, (str) => str.substring(1).toUpperCase());
    // 挂载controller到内存 app 对象中
    let tempController = controller;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < names.length; i++) {
      const newName = names[i];
      if (i === len - 1) {
        // 文件
        const ControllerModule = require(path.resolve(file))(app);
        tempController[newName] = new ControllerModule();
      } else {
        // 文件夹
        tempController[newName] = tempController[newName] || {};
        tempController = tempController[newName];
      }
    }
  });
  app.controller = controller;
};
