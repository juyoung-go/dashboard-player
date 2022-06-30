const {contextBridge, ipcRenderer} = require('electron')
contextBridge.exposeInMainWorld('app', {
  send: (ch, arg) => {
      ipcRenderer.send(ch, JSON.stringify(arg))
  },
  on: (ch, callback) => {
      ipcRenderer.on(ch, callback)
}
})