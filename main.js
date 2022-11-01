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
1 == 1
1==1 && 2==2 && 3 == 3 //3 added to patch1 11111
app.on('window-all-closed', () => {
  app.quit()
})
