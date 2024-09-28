const { app, BrowserWindow, ipcMain, dialog, Menu, shell, globalShortcut, Notification } = require('electron')
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
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
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
}

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

})
// 关闭所有窗口时退出应用 (Windows & Linux)  如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})