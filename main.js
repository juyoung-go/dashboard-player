const { app } = require('electron')

const controller = require('./appmain/controller')
const player = require('./appmain/player')

//load ipc
require('./appmain/ipc')

app.on('ready', () => {
    controller()
    player()
})

//sonar test
//cleared!!!
app.on('window-all-closed', () => {
  app.quit()
})
