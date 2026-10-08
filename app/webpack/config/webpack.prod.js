const baseConfig = require("./webpack.base.js");
const merge = require("webpack-merge");
const path = require("path");
const HappyPack = require("happypack");
const os = require("os");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CSSminimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackInjectAttributesPlugin = require("html-webpack-inject-attributes-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

// 多线程build设置
const happypackCommonConfig = {
  debug: false,
  threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
};

// 生产环境webpack配置
const webpackConfig = merge.smart(baseConfig, {
  mode: "production", // 指定生产环境
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "happypack/loader?id=css"],
      },
      {
        test: /\.js$/,
        include: [path.resolve(process.cwd(), "./app/pages")],
        use: ["happypack/loader?id=js"],
      },
    ],
  },
  // 生产环境的output配置
  output: {
    filename: "js/[name]_[chunkhash:8].bundle.js",
    path: path.join(process.cwd(), "./app/public/dist/prod"),
    publicPath: "/dist/prod",
    crossOriginLoading: "anonymous",
  },
  // webpack不会有大量hints信息，默认为warning
  performance: {
    hints: false,
  },
  plugins: [
    // 每次build前，清空public/dist目录
    new CleanWebpackPlugin(["public/dist"], {
      root: path.resolve(process.cwd(), "./app/"),
      exclude: [],
      verbose: true,
      dry: false,
    }),
    // 提取css的公共部分，有效利用缓存，减少重复打包
    new MiniCssExtractPlugin({
      chunkFilename: "css/[name]_[contenthash:8].css",
    }),
    // 优化并压缩css资源
    new CSSminimizerPlugin(),
    // 多线程打包js，加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: "js",
      loaders: [
        `babel-loader?${JSON.stringify({
          presets: ["@babel/preset-env"],
          plugins: ["@babel/plugin-transform-runtime"],
        })}`,
      ],
    }),
    // 多线程打包css，加快打包速度
    new HappyPack({
      ...happypackCommonConfig,
      id: "css",
      loaders: [
        {
          path: "css-loader",
          options: {
            importLoaders: 1,
          },
        },
      ],
    }),
    // 浏览器在请求资源时不发送用户的身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossorigin: "anonymous",
    }),
  ],
  optimization: {
    // 使用TerserWebpackPlugin的并发和缓存，提升压缩阶段的性能
    // 清除console.log
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        cache: true, // 启用缓存来加速构建过程
        parallel: true, // 利用多核CPU的优势来加快压缩速度
        extractComments: false,
        terserOptions: {
          compress: {
            drop_console: true, // 删除console.log
          },
        },
      }),
    ],
  },
});

module.exports = webpackConfig;
