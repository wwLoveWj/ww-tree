const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 * webpack插件将打包好的文件注入到html模板里
 * @type {HtmlWebpackPlugin}
 */
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, "./public/index.html"),
  filename: "./index.html",
});

module.exports = {
  // mode: "development", //这个值有3种：production、development、none
  // entry: path.join(__dirname, "./src/index"),
  entry: path.join(__dirname, "./public/app.tsx"), //test
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    library: "ww-antd-tree",
    libraryTarget: "umd",
    libraryExport: "default", // 不添加的话引用的时候需要 xxx.default
    sourceMapFilename: "[file].map", // string
    clean: true, // 清除输出目录
    // // 输出类型 (amd, cjs, es, iife, umd, system)：
    //     // iife——最早的模块，jQuery时代流行，封装成一个自执行函数，缺点是污染全局变量，且需手动维护script标签加载顺序
    //     // cjs——即CommonJS，解决了以上问题，但只运行在node.js环境，不支持浏览器。
    //     // amd——通过requirejs实现，支持浏览器，解决了前面所有问题，但写法复杂，可读性很差，不符合通用的模块化思维
    //     // umd——兼容了cjs和amd，但产生了更难理解的代码，包也增大
    //     // system——面向未来的模块依赖方式，微前端流行
    //     // es——现代化标准
    //     format: 'cjs'

    // 原文链接：https://blog.csdn.net/weixin_43787651/article/details/131516690
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
  },
  devtool: "source-map",
  // 使自己项目中依赖于宿主项目里的库，不重复打包,比如react，因为引入的肯定是react项目，所以不需要再将react打包进npm包
  // externals: {
  //   react: {
  //     commonjs: "react",
  //     commonjs2: "react",
  //     amd: "react",
  //     root: "React",
  //   },
  //   "react-dom": {
  //     commonjs: "react-dom",
  //     commonjs2: "react-dom",
  //     amd: "react-dom",
  //     root: "ReactDOM",
  //   },
  //   lodash: "lodash",
  // },
  // 原文链接：https://blog.csdn.net/SaRAku/article/details/111555270
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        // use: "babel-loader",
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/, // 排除 node_modules 目录
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }], //打包处理css样式表的第三方loader
      },
      {
        //只为less启用模块化
        test: /\.less$/,
        // use: ["style-loader", "css-loader", "less-loader"],
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {
              modules: { localIdentName: "[path][name]-[local]-[hash:5]" },
              //   modules: true,
            },
          },
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                strictMath: false,
                javascriptEnabled: true,
                math: "always",
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [htmlWebpackPlugin], //插件：自动注入编译打包好的文件
  devServer: {
    port: 8001, //端口号
    open: true, // 自动打开浏览器
    compress: true, // 启动gzip压缩
  },
};
