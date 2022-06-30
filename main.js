const { app } = require('electron')

const controller = require('./appmain/controller')
const player = require('./appmain/player')

//load ipc
require('./appmain/ipc')

app.on('ready', () => {
    controller()
    player()
})

app.on('window-all-closed', () => {
  app.quit()
})