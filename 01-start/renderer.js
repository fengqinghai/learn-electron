console.log('我是renderer.js')
const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${window.versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`
const func = async () => {
  const response = await window.versions.ping()
  console.log(response) // 打印 'pong'
}

func();
// 动态设置窗口标题
const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
  const title = titleInput.value
  window.electronAPI.setTitle(title)
})


// 双向通信，打开原生文件对话框，并返回选择文件的路径
const btnOpenFile = document.getElementById('btn-open-file')
const filePathElement = document.getElementById('filePath')

btnOpenFile.addEventListener('click', async () => {
  const filePath = await window.electronAPI.openFile()
  filePathElement.innerText = filePath
})
// 计数器
const counter = document.getElementById('counter')

window.electronAPI.onUpdateCounter((value) => {
  const oldValue = Number(counter.innerText)
  const newValue = oldValue + value
  counter.innerText = newValue.toString()
  window.electronAPI.counterValue(newValue)
})