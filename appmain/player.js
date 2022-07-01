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
        title:"Dashboard Player",
        resizable:true,
        show: false,
        frame: false,
        transparent:false,
        fullscreenable:true,
        fullscreen:true,
        useContentSize:true,
        closable:false,
        webPreferences: {
            devTools:isLocal,
            nodeIntegration: false, // is default value after Electron v5
            contextIsolation: true, // protect against prototype pollution
            enableRemoteModule: false, // turn off remote
            preload: path.resolve(__dirname, "../preload.js") // use a preload script
        }
    })

    store.set('player', win)

    if (isLocal) {
        
        //devtools event
        win.webContents.on('before-input-event', (e, input)=>{
            if(input.type === 'keyUp' && input.code === 'F12'){
                win.webContents.toggleDevTools()
                return false
            }
        })

    }

    win.once('ready-to-show', () => {

        win.show()

    })

    win.on('close', () => {
        win.hide()
        return false
    })

    win.on('resized', () => {
        const views = win.getBrowserViews()
        if(views){
            for(let view of views){
                view.setBounds(win.getBounds())
            }
        }
    })
    
}