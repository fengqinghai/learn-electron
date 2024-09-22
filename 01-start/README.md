第一节是创建一个最基础的elelctron应用示例
yarn init -y 
将package.json中的main字段改为"main": "main.js",
以下是打包必填的字段
"author": "Jane Doe 打包必填",
"description": "Hello World! 打包必填",

安装elelctron为开发依赖
yarn add elelctron -

安装时如果发现elelctron安装失败
可以在项目下创建.yarnrc文件
内容为
registry "https://registry.npmmirror.com"
ELECTRON_MIRROR "https://npmmirror.com/mirrors/electron/"


额外：将功能添加到您的网页内容
对于与您的网页内容的任何交互，您想要将脚本添加到您的渲染器进程中。 由于渲染器运行在正常的 Web 环境中，因此您可以在 index.html 文件关闭 </body> 标签之前添加一个 <script> 标签，来包括您想要的任意脚本：
<script src="./renderer.js"></script>


# 打包并分发您的应用程序
1，首先将package.json中的 description 字段补齐，不能为空，否则打包不成功,
2，将 Electron Forge 添加到您应用的开发依赖中，并使用其"import"命令设置 Forge 的脚手架：
yarn add --dev @electron-forge/cli
npx electron-forge import
3，使用 Forge 的 make 命令来创建可分发的应用程序
yarn make