const path = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const glob = require("glob");

// 动态构造
const pageEntries = {};
const htmlWebpackPluginList = [];

// 获取app/pages 目录下所有入口文件（entry.xxx.js）
const entryList = path.resolve(process.cwd(), `./app/pages/**/entry.*.js`);
glob.sync(entryList).forEach((file) => {
  const entryName = path.basename(file, ".js");
  // 构造entry
  pageEntries[entryName] = file;
  // 构造最终渲染的页面文件
  htmlWebpackPluginList.push(
    // html-webpack-plugin 辅助注入打包后的 bundle 文件到 tpl文件中
    new HtmlWebpackPlugin({
      // 产物（最终输出路径）
      filename: path.resolve(
        process.cwd(),
        "./app/public/dist",
        `${entryName}.tpl`
      ),
      // 指定要使用的模板文件
      template: path.resolve(process.cwd(), "./app/view/entry.tpl"),
      // 要注入的代码块
      chunks: [entryName],
    })
  );
});
console.log("pageEntry", pageEntries);
console.log("htmlwebpackPlugin", htmlWebpackPluginList);

/**
 * webpack 基础配置
 */
module.exports = {
  // 入口配置
  entry: pageEntries,
  // 模块解析配置（决定了要加载解析那些模块以及用什么方式去解析）
  module: {
    rules: [
      {
        test: /.vue$/,
        use: {
          loader: "vue-loader",
        },
      },
      {
        test: /.js$/,
        include: [path.resolve(__dirname, "./app/pages")], // 只对业务代码进行babel，加快webpack打包速度
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|jpe?g|gif)(\?.+)?$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 300,
            esModule: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
        use: "file-loader",
      },
    ],
  },
  // 产物输出路径 因为开发和生产环境产物输出路径不一样，所以在各自文件中配置
  output: {},
  // 配置模块解析的具体行为（webpack在打包时如何找到并解析具体模块的路径）
  resolve: {
    extensions: [".js", ".vue", ".less", ".css"],
    alias: {
      $pages: path.resolve(process.cwd(), "./app/pages"),
      $common: path.resolve(process.cwd(), "./app/pages/common"),
      $widgets: path.resolve(process.cwd(), "./app/pages/widgets"),
      $store: path.resolve(process.cwd(), "./app/pages/store"),
    },
  },
  // 配置webpack插件
  plugins: [
    // 处理.vue文件，这个插件是必须的
    //  将定义过的其他规则复制并应用到.vue文件里
    new VueLoaderPlugin(),
    // 把第三方库暴露到 window context下
    new webpack.ProvidePlugin({
      Vue: "vue",
      axios: "axios",
      _: "loadash",
    }),
    // 定义全局常量
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: "true", // 支持 vue 解析 optionsApi
      __VUE_PROD_DEVTOOLS__: "false", // 禁用Vur调试工具
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false", // 禁用生产环境显示“水合”信息
    }),
    // 构造函数渲染的页面模板
    ...htmlWebpackPluginList,
  ],
  // 配置打包输出优化（代码分割，模块合并，缓存，TreeShaking，压缩等优化策略）
  optimization: {
    /**
     * 把js文件打包成3种类型
     * 1.vendor： 第三方 lib 库，基本不会改动，除非依赖版本升级
     * 2.common： 业务组件代码的公共部分抽离出来，改动较少
     * 3.entry.{page}： 不同页面entry里的业务组件代码的差异部分，会经常改动
     * 目的：把改动和引用频率不一样的js区分出来，以达到更好利用浏览器缓存的效果
     */
    splitChunks: {
      chunks: "all", // 对同步和异步模块都进行分割
      maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
      maxInitialRequests: 10, // 入口点的最大并行请求数
      cacheGroups: {
        // 第三方依赖库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor", // 模块名称
          priority: 20, // 优先级，数字越大优先级越高
          enforce: true, // 强制执行
          reuseExistingChunk: true, // 如果当前 chunk 包含的模块已经被抽取出去了，那么它将被忽略
        },
        // 公共模块
        common: {
          name: "common",
          minChunks: 2, // 最小引用次数
          minSize: 1, // 最小引用字节
          priority: 10, // 优先级，数字越大优先级越高
          reuseExistingChunk: true, // 复用已有的公共chunk
        },
      },
    },
    runtimeChunk: true,
  },
};
