const path = require("path");
const { sep } = path;
const glob = require("glob");
/**
 * service loader
 * @param {object} app koa实例
 *  加载所有 service ，通过app.service.${目录}.${文件}’ 访问
 * 例子：
     app/service
       |
       | -- custom-module
                |
                | -- custom-service.js
    => app.service.customModule.customService
 */

module.exports = (app) => {
  // 读取 app/service/**/**.js 目录下所有文件
  const servicePath = path.resolve(app.businessPath, `.${sep}service`);
  const fileList = glob.sync(path.resolve(servicePath, `.${sep}**${sep}**.js`));
  // 遍历所有文件，把内容加载到 app.service 中
  const service = {};
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file);
    // 截取路径
    name = name.substring(
      name.lastIndexOf(`service${sep}`) + `service${sep}`.length,
      name.lastIndexOf(".")
    );
    // 把”-“统一改成驼峰式
    name = name.replace(/[_-][a-z]/gi, (str) => str.substring(1).toUpperCase());
    // 挂载middleware到内存 app 对象中
    let tempService = service;
    const names = name.split(sep);
    for (let i = 0, len = names.length; i < names.length; i++) {
      const newName = names[i];
      if (i === len - 1) {
        // 文件
        const ServiceModule = require(path.resolve(file))(app);
        tempService[newName] = new ServiceModule();
      } else {
        // 文件夹
        tempService[newName] = tempService[newName] || {};
        tempService = tempService[newName];
      }
    }
  });
  app.service = service;
};
