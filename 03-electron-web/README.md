# 03-electron-web
# 兼容 web版
1. 添加 vite.config.js
修改root  root: path.join(__dirname, 'src/renderer'),

2. package.json加几个命令
"dev": "vite --mode development",
"build": "vite build  --mode production",
"preview": "vite preview",
"es": "electron-vite dev",
"eb": "electron-vite build",

打包时 安装了 yarn add terser -D
因为terser不再内置于vite中

target从 'es2015/es6' 修改为 es2015


### Install

```bash
$ yarn
```

### Development

```bash
$ yarn dev
```

### Build

```bash
# For windows
$ yarn build:win

# For macOS
$ yarn build:mac

# For Linux
$ yarn build:linux
```
