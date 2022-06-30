const {BrowserView} = require('electron')

class SlideWindow {

  constructor(scriptInfo, slide, win){

    //시나리오 저장
    this.scriptInfo = scriptInfo

    //계정정보 저장
    this.slide = slide

    //타겟 윈도우
    this.win = win

    console.log('slide for win => ', win)
    
    //view 생성
    this.view = new BrowserView({
      show: true,
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
    this.wc.loadURL(this.scriptInfo.home)

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

  }

  async init(){
    this.currType = 'init'
    this.playMain(undefined)
  }

  async ready(){
    this.currType = 'play'
    if(!this.scriptInfo.target) return
    
    console.log('play start with loadURL start', this.scriptInfo.target)
    this.wc.loadURL(this.scriptInfo.target)
    this.wc.once('did-finish-load', (e)=>{
      console.log('play start with loadURL end', this.scriptInfo.target)
      this.playMain(undefined)
    })
  }

  async playMain(idx){

    try{
      if(idx === undefined) idx = 0
      this.currItem = this.scriptInfo[this.currType][idx]

      if(!this.currItem) {
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

        setTimeout(()=>{
          this.playMain(idx + 1);
        }, this.currItem.timeAfter)

      }else if(this.currItem.eventAfter){

        this.reserveNext = idx;

      }else{
        this.playMain(idx + 1);
      }
    }catch(e){
      console.log('playMain ('+idx+') error', e)
    }
  
  }

}

module.exports = SlideWindow