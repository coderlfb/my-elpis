module.exports = (app) => {
  return class BaseController {
    /**
     * controller基类
     * 统一收拢所有controller相关的公共方法
     */
    constructor() {
      this.app = app;
      this.config = app.config;
    }
    /**
     * api处理成功是返回统一结构
     * @param {object} ctx 上下文对象
     * @param {object} data 核心数据
     * @param {object} metadata 附加数据
     */
    success(ctx, data = {}, metadata = {}) {
      ctx.status = 200;
      ctx.body = {
        success: true,
        data,
        metadata,
      };
    }
    /**
     * api处理失败时返回统一结构
     * @param {object} ctx 上下文对象
     * @param {string} message 错误信息
     * @param {number} code 错误码
     */
    fail(ctx, message, code) {
      ctx.body = {
        success: false,
        message,
        code,
      };
    }
  };
};
