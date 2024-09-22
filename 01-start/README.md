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

补充，第一次执行yarn make报错了，第二次执行成功打包了

可选：使用 VS Code 调试
如果您希望使用 VS Code 调试您的程序，您需要让 VS Code 监听主进程 (main process) 和渲染器进程 (renderer process) 。 下面为您提供了一个简单的配置文件。 请在根目录新建一个 .vscode 文件夹，然后在其中新建一个 launch.json 配置文件并填写如下内容。

保存后，当您选择侧边栏的 “运行和调试”，将会出现一个 "Main + renderer" 选项。然后您便可设置断点，并跟踪主进程和渲染器进程中的所有变量。

上文中我们在 launch.json 所做的其实是创建三个配置项：

1,Main 用来运行主程序，并且暴露出 9222 端口用于远程调试 (--remote-debugging-port=9222) 。 我们将把调试器绑定到那个端口来调试 renderer 。 因为主进程是 Node.js 进程，类型被设置为 node。
2,Renderer 用来调试渲染器进程。 因为后者是由主进程创建的，我们要把它 “绑定” 到主进程上 ()"request": "attach"，而不是创建一个新的。 渲染器是 web 进程，因此要选择 chrome 调试器。
3,Main + renderer 是一个 复合任务，可以同时执行上述任务。


Electron Forge CLI 文档 https://www.electronforge.io/cli#commands

将代码推送到github上
首先在github上创建一个仓库
因为我的代码在gitlab上存储了，所以在创建github仓库时不用创建.gitignore，READED.md文件
git remote add github https://github.com/fengqinghai/learn-electron.git
git push -u github main
然后输入账号密码，即可推送到github上

设置 GitHub 发布者
yarn add --dev @electron-forge/publisher-github
在 Forge 中配置发布者
forge.config.js
```
module.exports = {
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'github-user-name',
          name: 'github-repo-name'
        },
        prerelease: false,
        draft: true
      }
    }
  ]
}
```
选择Tokens (classic)  将repo都勾选上
在github上生成一个个人 掏肯
cmd打开dos窗口 set GITHUB_TOKEN=掏肯 【这个设置方式是会话token，关闭窗口后就失效，许要在我的电脑，属性-高级系统设置-系统环境变量中新建 GITHUB_TOKEN=掏肯】
然后关闭vscode，删除out文件，从新打包发布

在dos窗口中执行 curl -H "Authorization: token 掏肯" https://api.github.com/user
能打印出自己的github信息，就代表token生效了

执行yarn run publish 或 npm run publish 避免和发布npm包的命令(yarn publish或npm publish)冲突
成功发布!!!



