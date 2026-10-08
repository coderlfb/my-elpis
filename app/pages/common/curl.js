const md5 = require("md5");
import { ElMessage } from "element-plus";

/**
 * 前端封装的curl方法
 * @params 请求配置
 */
const curl = ({
  url, // 请求地址
  method = "post", // 请求方法
  headers = {}, // 请求头
  query = {}, // url 请求参数
  data = {}, // body 请求参数
  responseType = "json",
  timeout = 60000,
  errorMessage = "网络异常",
}) => {
  // 接口签名处理
  const signKey = "sd08ga3h5f7gd9gs0g12g3g3fwrth245";
  const st = Date.now();
  // 构造请求参数 (把参数转换为axios参数)
  const ajaxSetting = {
    url,
    method,
    params: query,
    data,
    responseType,
    timeout,
    headers: {
      ...headers,
      // 签名
      s_t: st,
      s_sign: md5(`${signKey}_${st}`),
    },
  };

  return axios
    .request(ajaxSetting)
    .then((res) => {
      const resData = res.data || {};

      // 后端API返回格式
      const { success } = resData;

      // 失败
      if (!success) {
        const { message, code } = resData;
        if (code === 442) {
          ElMessage.error("请求参数异常");
        } else if (code === 445) {
          ElMessage.error("请求不合法");
        } else if (code === 50000) {
          ElMessage.error(message);
        } else {
          ElMessage.error(errorMessage);
        }

        console.error(message);
        return Promise.resolve({ success, message, code });
      }

      // 成功
      const { data, metadata } = resData;
      return Promise.resolve({ success, data, metadata });
    })
    .catch((err) => {
      const { message } = err;
      if (message.match(/timeout/)) {
        return Promise.resolve({
          message: "Request Timeout",
          code: 504,
        });
      }
      return Promise.resolve(err);
    });
};

export default curl;
