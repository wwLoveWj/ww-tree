npm 打包组件
package.json 中的两个必要配置：
"main": "lib/index.js",
"module": "es/index.js",
脚本配置：
"lib": "gulp lib",
"es": "gulp es",

然后写入当前 gulpfile.mjs 的配置：
mjs 结尾表示使用 import 导入包

(参考链接)[https://segmentfault.com/a/1190000018242549]
