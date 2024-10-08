const { app, BrowserWindow, ipcMain, dialog, Menu, shell, globalShortcut, Notification, Tray, nativeImage } = require('electron')
const path = require('node:path')
const updateElectronApp = require('update-electron-app');
updateElectronApp.updateElectronApp()

// 打开一个原生文件对话框
async function handleFileOpen () {
  const { canceled, filePaths } = await dialog.showOpenDialog()
  if (!canceled) {
    return filePaths[0]
  }
}
let progressInterval = null;
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true, // frame: false 无边框窗口是没有 chrome 的窗口，窗口的 chrome 是指窗口的某些部分（例如工具栏、控件等），它们不是网页的一部分。
    titleBarStyle: 'hidden', // titleBarStyle: 'hidden'和frame: false可以达到相同的效果，一个是隐藏一个是不需要
    // transparent: true, // 创建透明窗口 设置titleBarStyle: 'hidden'时才生效？
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // 由原生操作系统菜单控制的数字计数器
  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        {
          click: () => mainWindow.webContents.send('update-counter', 1),
          label: 'Increment'
        },
        {
          click: () => mainWindow.webContents.send('update-counter', -1),
          label: 'Decrement'
        },
        { // 用默认浏览器打开网页
          click: () => shell.openExternal('http://www.baidu.com'),
          label: 'openExternal'
        }
      ]
    }
  ]);
  // Menu.setApplicationMenu(menu);
  // Menu.setApplicationMenu(null); // 不需要默认菜单时
  ipcMain.on('counter-value', (_event, value) => {
    console.log(value) // will print value to Node console
  })
  // 动态设置窗口标题
  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
  })
  // 双向通信，打开原生文件对话框,返回选择的问价你路径
  ipcMain.handle('dialog:openFile', handleFileOpen);
  // 拦截快捷键(这样会拦截web中监听键盘事件 ctrl+i会被拦截)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    // console.log('input.key', input.key)
    if (input.control && input.key.toLowerCase() === 'i') {
      console.log('Pressed Control+I')
      event.preventDefault()
    }
  })

  // 通知
  
  ipcMain.on('main-notice', (_event, value) => {
    const {title, body} = value;
    new Notification({ title, body }).show();
  })

  mainWindow.loadFile('index.html')

  // 进度条
  const INCREMENT = 0.03
  const INTERVAL_DELAY = 100 // ms
  let c = 0
  progressInterval = setInterval(() => {
    // update progress bar to next value
    // values between 0 and 1 will show progress, >1 will show indeterminate or stick at 100%
    mainWindow.setProgressBar(c)

    // increment or reset progress bar
    if (c < 2) {
      c += INCREMENT
    } else {
      c = (-INCREMENT * 5) // reset to a bit less than 0 to show reset state
    }
  }, INTERVAL_DELAY);

  // 创建点击穿透窗口
  // mainWindow.setIgnoreMouseEvents(true)
}
let tray; // 系统托盘
app.whenReady().then(() => {
  ipcMain.handle('ping', () => 'pong')
  createWindow()
  // 如果没有窗口打开则打开一个窗口 (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  // 注册全局快捷键
  globalShortcut.register('Alt+CommandOrControl+I', () => {
    console.log('Electron loves global shortcuts!')
  })
  // 添加系统托盘
  const icon = nativeImage.createFromPath(path.resolve(__dirname, './public/image/testIcon.png'))
  tray = new Tray(icon);
  // 开始将上下文菜单附加到我们的托盘上
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Item1', type: 'radio' },
    { label: 'Item2', type: 'radio' },
    { label: 'Item3', type: 'radio', checked: true },
    { label: 'Item4', type: 'radio' }
  ]);
  tray.setContextMenu(contextMenu)
  // 给我们的托盘一个工具提示和标题。
  tray.setToolTip('托盘提示')
  tray.setTitle('托盘标题')
})
// 关闭所有窗口时退出应用 (Windows & Linux)  如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
// app退出时, clear both timers
app.on('before-quit', () => {
  clearInterval(progressInterval)
})
