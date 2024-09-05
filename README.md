### npm 打包组件

npm pack 将需要打包上传到 npm 的所有文件打个压缩包出来
npm publish --access=public //写成@custom/comonents 私有包，npm publish --access=public 将这个包变为共有的包
"build": "tsc && vite build && tsc --declaration",
tsc -- declaration 命令告诉 TypeScript 编译器在编译 TypeScript 文件时生成对应的类型声明文件（.d.ts 文件）
npm whoami 验证是否登录成功，登陆的是哪个用户
npm version patch //更新包版本
npm unpublish 包名@版本号 //删除指定版本包
npm unpublish 包名 --force //删除 npm 所有版本包
npm config get prefix 获取 npm 的安装路径

# 自动更新补丁版本号

npm version patch

# 自动更新次版本号

npm version minor

# 自动更新主版本号

npm version major

<!-- 原文链接：https://blog.csdn.net/hzxOnlineOk/article/details/130058962 -->

@babel/cli： babel 配置的脚手架
@babel/core： 把开发的 nodejs 编译成前端可以运行的 js 代码
@babel/preset-react： 把 react 编译成可执行 js
@babel/preset-env： 将 es6 代码转成 es5
@babel/plugin-transform-runtime： 自动移除语法转换后内联的辅助函数以及做 API 转换，对内置对象进行重命名，以防止污染全局环境
babel-loader：负责调用上面所有@babel 的依赖模块

### 调试包

npm link 在需要发布的项目中
npm link ww-antd-tree 在需要使用这个包的仓库中
结束后回到模块目录。 npm unlink
废弃包：npm deprecate --force js-util-libs@1.0.0 "这个包不在维护了。"//这个包并不会删除，只是在别人下载使用的时候会提示

package.json 中的两个必要配置：
"main": "lib/index.js",
"module": "es/index.js",
脚本配置：
"lib": "gulp lib",
"es": "gulp es",

然后写入当前 gulpfile.mjs 的配置：
mjs 结尾表示使用 import 导入包

(参考链接)[https://segmentfault.com/a/1190000018242549]

(patch-package 的报错处理：)[https://blog.csdn.net/qq_43422972/article/details/140912599]

### 包的发布

在 npm 包的发布过程中，手动执行 npm publish 可能会比较繁琐，尤其是在需要频繁更新版本时。为了简化这一流程，可以使用 np 这个工具。np 是一个 npm 包，它提供了一系列的功能来帮助开发者更高效地发布 npm 包。
