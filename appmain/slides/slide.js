const {BrowserView} = require('electron')

class SlideWindow {

  constructor(scriptInfo, slide, win){

    //시나리오 저장
    this.scriptInfo = scriptInfo

    //계정정보 저장
    this.slide = slide

    //타겟 윈도우
    this.win = win

    //view 생성
    this.view = new BrowserView({
      show: true,
      transparent:false,
      backgroundColor:'white',
      webPreferences: {
        devTools:true,
      }
    })

    //view 설정
    this.win.addBrowserView(this.view)
    this.view.setBounds(this.win.getBounds())
    //this.view.setBounds({ x: 0, y: 0, width: 300, height: 300 })

    //web contents
    this.wc = this.view.webContents;

    //load home
    if(this.scriptInfo){
      this.wc.loadURL(this.scriptInfo.home)
    }else if(this.slide.url){
      this.wc.loadURL(this.slide.url)
    }

    //devtools event
    this.wc.on('before-input-event', (e, input)=>{
      if(input.type === 'keyUp' && input.code === 'F12'){
        this.wc.toggleDevTools()
        return false
      }
    })

    //page load 이벤트
    this.wc.on('did-finish-load', (e)=>{
        console.log('did-finish-load => ', e.sender.getURL())

        if (this.prcsInit === false) {
            this.init()
            this.prcsInit = true;
        }
        
        if(this.reserveNext !== undefined){
            const nextIdx = this.reserveNext + 1;
            this.reserveNext = undefined
            this.playMain(nextIdx);
        }
    })

    //시나리오 play 변수
    this.prcsInit = false;
    this.currType;
    this.currItem;
    this.reserveNext;
    this.status = ''

  }

  async init(){

    if(!this.scriptInfo){
      this.status = 'ready'
      console.log('[init] status set to ['+this.status+']');
      return
    }

    this.currType = 'init'
    await this.playMain(undefined)
    this.status = 'ready'
    console.log('[init] status set to ['+this.status+']');
  }

  destroy(){
    this.wc = null
    this.view = null
  }

  async ready(){

    if(!this.scriptInfo || !this.scriptInfo.target){
      return
    }

    this.status = 'playing'
    this.currType = 'play'

    return new Promise((resolve)=>{
      
      try{

        console.log('play start with loadURL start', this.scriptInfo.target)
        this.wc.loadURL(this.scriptInfo.target)
        this.wc.once('did-finish-load', async (e)=>{
          console.log('play start with loadURL end', this.scriptInfo.target)
          await this.playMain(undefined)
          this.status = 'ready'
          console.log('[playing] status set to ['+this.status+']');
          resolve(true)
        })

      }catch(e){
        resolve(false)
      }

    })

  }

  async playMain(idx){

    return new Promise(async (resolve)=>{

      try{

        if(idx === undefined) idx = 0
        this.currItem = this.scriptInfo[this.currType][idx]
  
        if(!this.currItem) {
          resolve(true)
          console.log('scriptInfo play end at index:'+idx)
          return
        }
  
        console.log('scriptInfo playing at index:' + idx, this.currItem.code)
        
        const id = this.slide.id
        const pass = this.slide.pass
        
        const result = await this.wc.executeJavaScript(
          this.currItem.code.indexOf('${') >= 0 ? eval(this.currItem.code) : this.currItem.code
        )
  
        console.log('result '+idx, result)
  
        if(this.currItem.timeAfter){
  
          setTimeout(async ()=>{
            await this.playMain(idx + 1);
            resolve(true)
          }, this.currItem.timeAfter)
  
        }else if(this.currItem.eventAfter){
  
          this.reserveNext = idx;
          resolve(true)

        }else{
          await this.playMain(idx + 1);
          resolve(true)
        }

      }catch(e){
        console.log('playMain ('+idx+') error', e)
        resolve(false)
      }

    })
  
  }

}

module.exports = SlideWindow