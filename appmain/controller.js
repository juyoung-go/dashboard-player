const path = require('path')
const {BrowserWindow} = require('electron')

const store = require('./store')

let win;
module.exports = function(){

    if(win) return

    let port;
    process.argv.forEach((arg)=> {
        if (!isNaN(Number(arg))) {
            port = Number(arg);
            return false;
        }
    })

    let isLocal = port && port > 0

    win = new BrowserWindow({
        width: 1280, height: 800,
        //minWidth: 360, minHeight: 286,
        title:"Dashboard Controller",
        resizable:true,
        show: false,
        frame: true,
        transparent:false,
        fullscreenable:true,
        useContentSize:true,
        webPreferences: {
            devTools:isLocal,
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.resolve(__dirname, "../preload.js") // use a preload script
        }
    })

    store.set('controller', win)

    if (isLocal) {
        
        win.loadURL('http://localhost:'+port);

        //devtools event
        win.webContents.on('before-input-event', (e, input)=>{
            if(input.type === 'keyUp' && input.code === 'F12'){
                win.webContents.toggleDevTools()
                return false
            }
        })

    } else {
        win.loadFile(path.resolve(__dirname, '../webapp/dist/index.html'))
    }

    win.once('ready-to-show', () => {

        win.show()

    })

    win.on('close', () => {
        for(let tempWin of BrowserWindow.getAllWindows()){
            if(win != tempWin){
                if(tempWin.closable){
                    tempWin.close()
                }else{
                    tempWin.destroy()
                }
            }
        }
    })
    
}