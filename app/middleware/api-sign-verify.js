const md5 = require("md5");

/**
 * 签名合法性校验
 * @param {object} app
 */
module.exports = (app) => {
  return async (ctx, next) => {
    // 只对api请求做签名校验
    if (ctx.path.indexOf("/api") < 0) {
      return await next();
    }
    const { path, method } = ctx;
    const { headers } = ctx.request;
    const { s_sign: sSign, s_t: st } = headers;

    const signKey = "sd08ga3h5f7gd9gs0g12g3g3fwrth245";
    const signature = md5(`${signKey}_${st}`);
    app.logger.info(`[${method} ${path}] signature: ${signature}`);

    if (
      !sSign ||
      !st ||
      signature !== sSign.toLowerCase() ||
      Date.now() - st > 600000
    ) {
      ctx.status = 200;
      ctx.body = {
        success: false,
        code: 50000,
        message: "signature not correct or api timeout",
        code: 445,
      };
      return;
    }
    await next();
  };
};
