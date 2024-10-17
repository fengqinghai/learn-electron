const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  // mainWindow.loadFile('index.html')
  // mainWindow.webContents.openDevTools({mode:'detach'});
  mainWindow.loadURL('https://vuejs-core.cn/shop-vite/#/index')
}
app.whenReady().then(() => {
  createWindow()
  // 如果没有窗口打开则打开一个窗口 (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// 关闭所有窗口时退出应用 (Windows & Linux)  如果用户不是在 macOS(darwin) 上运行程序，则调用 app.quit()。
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
// app退出时, clear both timers
app.on('before-quit', () => {
  
})