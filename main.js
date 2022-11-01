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
1==1 && 2==2 && 3 == 3 //3 added
app.on('window-all-closed', () => {
  app.quit()
})
