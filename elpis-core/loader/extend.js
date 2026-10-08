const path = require("path");
const { sep } = path;
const glob = require("glob");
/**
 * controller loader
 * @param {object} app koa实例
 *  加载所有 controller ，通过app.extend.${文件}’ 访问
 * 例子：
     app/extend
        | -- custom-extend.js
    => app.extend.customExtend  
 */

module.exports = (app) => {
  // 读取 app/extend/**.js 目录下所有文件
  const extendPath = path.resolve(app.businessPath, `.${sep}extend`);
  const fileList = glob.sync(path.resolve(extendPath, `.${sep}**${sep}**.js`));
  // 遍历所有文件，把内容加载到 app.extend 中
  //   const extend = {};
  fileList.forEach((file) => {
    // 提取文件名称
    let name = path.resolve(file);
    // 截取路径
    name = name.substring(
      name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,
      name.lastIndexOf(".")
    );
    // 把”-“统一改成驼峰式
    name = name.replace(/[_-][a-z]/gi, (str) => str.substring(1).toUpperCase());
    // 过滤器 app 已经存在的key
    for (const key in app) {
      if (key === name) {
        console.log(`[extend load error] name:${name} is already in app`);

        return;
      }
    }
    // 挂载extend到内存 app 对象中
    app[name] = require(path.resolve(file))(app);
  });
};
