const superagent = require("superagent");
module.exports = (app) =>
  class BaseService {
    /**
     * service基类
     * 统一收拢所有service层的公共方法
     */
    constructor() {
      this.app = app;
      this.config = this.config;
      this.curl = superagent;
    }
  };
