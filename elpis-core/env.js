module.exports = (app) => {
  return {
    // 判断是否是本地环境
    isLocal() {
      return process.env._ENV === "local";
    },
    // 是否是测试环境
    isBeta() {
      return process.env._ENV === "beta";
    },
    // 是否是生产环境
    isProduction() {
      return process.env._ENV === "production";
    },
    // 获取当前环境
    get() {
      return process.env._ENV ?? "local";
    },
  };
};
