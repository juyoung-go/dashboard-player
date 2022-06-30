
const SlideWindow = require('../slides/slide')
const slides = []

const store = require('../store')

let playing = false;

let currIdx = 0
let iter = 0
const initPlay = ()=>{
  currIdx = 0
  iter = 0
  const slideWindow = slides[0]
  if(slideWindow){
    const playerWindow = store.get('player')
    playerWindow && playerWindow.setTopBrowserView(slideWindow.view)
    playerWindow.show()
  }
}

const playerFunction = ()=>{

  if(playing){
    
    let slideWindow = slides[currIdx]

    if(slideWindow){
      
      iter += 1

      if(slideWindow.slide.sec <= iter){

        nextSlide()

        slideWindow = slides[currIdx]
        
        const playerWindow = store.get('player')
        playerWindow && playerWindow.setTopBrowserView(slideWindow.view)
        iter = 0
        
      }

    }
    
  }

}

const nextSlide = ()=>{
  let idx = currIdx + 1
  if(idx >= slides.length){
    idx = 0
  }
  currIdx = idx
}

let interval
const startPlay = ()=>{
  interval = setInterval(playerFunction, 1000)
  playing = true
}
const stopPlay = ()=>{
  interval && clearInterval(interval)
  playing = false
}

module.exports = {
  'create':function(arg){

    console.log('work start arg => ', arg)

    slides.length = 0

    const cnt = arg.slideList.length
    const slideList = arg.slideList

    const playerWindow = store.get('player')
    
    for(let slide of slideList){
      if(!slide.sec){
        slide.sec = 5 //기본 재생 5초
      }
      slides.push(new SlideWindow(require('../slides/script/'+slide.scriptName), slide, playerWindow))
    }

    slides[0] && playerWindow.setTopBrowserView(slides[0].view)
    playerWindow.show()

    console.log(cnt + ' slide created')

  },
  'ready': function(){
    for(let slide of slides){
      slide.ready()
    }
  },
  'play': function(){
    initPlay()
    startPlay()
  },
  'resume': function(){
    playing = true
  },
  'pause': function(){
    playing = false
  },
  'stop': function(){
    stopPlay()
  },
  'show': function({idx}){
    const slideWindow = slides[idx]
    if(slideWindow){

      const playerWindow = store.get('player')
      playerWindow && playerWindow.setTopBrowserView(slideWindow.view)

    }  
  },
}