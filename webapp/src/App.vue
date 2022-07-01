<template>

  <!-- app -->
  <div id="app" class="app">

    <!-- 현재 상태표시 -->
    <div class="state-bar">{{playStateSet[playState].name}}</div>

    <!-- 컨트롤 버튼 영역 -->
    <div class="section-btn">

      <button v-if="playState === 'none'" :disabled="processing" @click="invokeWork" class="btn btn-play">슬라이드 생성</button>
      <button v-if="playState === 'created'" :disabled="processing" @click="readyWork" class="btn btn-play">슬라이드 준비</button>
      
      <button v-if="playState === 'ready'" :disabled="processing" @click="playWork" class="btn btn-play">슬라이드 플레이</button>
      <button v-if="playState === 'play'" :disabled="processing" @click="stopWork" class="btn btn-play">슬라이드 정지</button>

      <button @click="saveWork" :disabled="processing" class="btn btn-save">슬라이드 정보 저장</button>

    </div>

    <!-- 컨트롤 버튼 영역 2 -->
    <div class="section-btn">
      <div style="display:flex;align-items:center;"><input type="checkbox" v-model="autoPlay" @change="setAutoPlay" style="width:20px;"><div>앱 시작시 자동 재생</div></div>
    </div>

    <!-- 데이터셋팅 부분 -->
    <div class="section-data">

      <div class="t-title">슬라이드 셋업</div>

      <div class="t-row">

        <div class="t-col">슬라이드 번호</div>
        <div class="t-col">종류</div>
        <div class="t-col">ID</div>
        <div class="t-col">PASSWORD</div>
        <div class="t-col">재생시간 (초)</div>
        <div class="t-col">추가</div>
        <div class="t-col">삭제</div>
        <div class="t-col">보기</div>
        
      </div>

      <div class="t-hline"></div>

      <template v-for="(slide, i) in slideList">
        
        <div v-if="i != 0" :key="'hline-'+i" class="t-hline"></div>
        <div :key="i" class="t-row" :style="isComplete(slide)?'background:lightgreen;':'background:#ff8282;'">
          
          <div class="t-col">{{' '+(i + 1)}}</div>
          <div class="t-col">
            <select v-model="slide.scriptName">
              <template v-for="(script, idx) in scriptList">
                <option :key="idx" :value="script.name">{{script.label}}</option>
              </template>
            </select>
          </div>
          <div class="t-col"><input v-model="slide.id"></div>
          <div class="t-col"><input v-model="slide.pass" type="password"></div>
          <div class="t-col"><input v-model="slide.sec" type="number" min="0" max="9999" maxlength="4"></div>
          <div class="t-col"><button @click="copySlide(i)">추가</button></div>
          <div class="t-col"><button @click="slideList.length > 1?slideList.splice(slideList.indexOf(slide), 1):null">삭제</button></div>
          <div class="t-col"><button v-if="playState === 'created'||playState === 'ready'" @click="showSlide(i)">슬라이드 보기</button></div>

        </div>
      </template>

    </div>

  </div>

</template>

<script>
export default {
  name: 'App',
  async created(){

    const loaded = this.loadWork()
    if(loaded && loaded instanceof Array){
      this.slideList = loaded
    }else{
      this.slideList.push(this.getDefaultSlide())
    }

    window.app.on('created', (
      //e, arg
      ) => {
      console.log('created from app!!');
      this.processing = false
      this.nextState()
      this.readyWork()
    })

    window.app.on('ready', (
      //e, arg
      ) => {
      console.log('ready from app!!');
      this.processing = false
      this.nextState()
    })

    this.autoPlay = this.loadAutoPlay()
    if(this.autoPlay && this.slideList.length > 0){
      this.invokeWork()
    }

  },
  data(){
    return {

      autoPlay: false,
      processing: false,
      
      playStateSet:{
        'none':{name:'준비',next:'created'},
        'created':{name:'슬라이드 생성 완료',next:'ready'},
        'ready':{name:'슬라이드 준비',next:'play'},
        'play':{name:'슬라이드 재생중',next:'ready'},
      },
      playState:'none',
      scriptList:[
        {
          name:'datadog-migo-admin',
          label:'MIGO Admin (DataDog)'
        },
        {
          name:'datadog-rfind-vn',
          label:'RFind Vn (DataDog)'
        },
        {
          name:'rtb-dashboard-kr',
          label:'RTB 한국'
        },
        {
          name:'rsquare-design',
          label:'RSQUARE Design'
        }
      ],

      defaultSlide:'{"id":null, "pass":null, "scriptName":"", "sec":5}',
      slideList:[],

    }
  },
  methods:{
    getDefaultSlide(){
      return JSON.parse(this.defaultSlide)
    },
    nextState(){
      this.playState = this.playStateSet[this.playState].next      
    },
    invokeWork(){
      this.processing = true
      this.isAllComplete()
      this.$sendToApp('create',
        {
          slideList:this.slideList,
        }
      )

    },
    readyWork(){
      this.processing = true
      this.$sendToApp('ready')
    },
    playWork(){
      this.play = true
      this.$sendToApp('play',
        {},
        this,
        this.nextState()
      )
    },
    stopWork(){
      this.play = false
      this.$sendToApp('stop',{}, this, ()=>{this.playState = 'ready'})
    },
    showSlide(idx){
      this.$sendToApp('show', {idx})
    },
    copySlide(idx){
      this.slideList.splice(idx + 1, 0, this.getDefaultSlide())
    },
    isComplete(slide){
      slide.id && (slide.id = slide.id.trim())
      slide.pass && (slide.pass = slide.pass.trim())
      slide.scriptName && (slide.scriptName = slide.scriptName.trim())
      return slide.id != '' && slide.pass != '' && slide.scriptName != ''
    },
    isAllComplete(){
      for(let slide of this.slideList){
        if(!this.isComplete(slide)){
          window.alert((this.slideList.indexOf(slide) + 1) + ' 번 슬라이드 정보가 모두 입력되지 않았습니다.')
          return false
        }
      }
      return true
    },
    saveWork(){
      this.isAllComplete()
      window.localStorage.setItem('slide_play_settings', JSON.stringify(this.slideList))
      window.alert('슬라이드 정보 저장 완료')
    },
    loadWork(){
      return JSON.parse(window.localStorage.getItem('slide_play_settings'))
    },
    loadAutoPlay(){
      return JSON.parse(window.localStorage.getItem('slide_auto_play'))
    },
    setAutoPlay(){
      window.localStorage.setItem('slide_auto_play', this.autoPlay)
      console.log('this.autoPlay => ',this.autoPlay);
    }
  }
}
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
body{
    margin:0px;
    font-size:12px;
    font-family: 나눔 고딕;
    overflow:hidden;
}
input{
    width:100%;
}
.app{
    position:relative;width:100vw;height:100vh;padding:20px;
}
.state-bar{
  text-align: center;
  font-size: 20px;
  color: deeppink;
}
.section-btn{
    display:flex;
    width:100%;
    height:30px;
    padding:6px;
    justify-content:flex-end;align-items:center;
}
.section-data{
    width:100%;
    height:calc(100% - 30px);
}
.btn{
    margin-left:10px;
    padding:5px 20px;
    border-radius: 5px;
    border:1px solid black;
    opacity:0.8;
}
.btn:hover{
  cursor:pointer;
  opacity:1;
}
.btn-play{
  background:lightgreen;
}
.btn-save{
  background:orange;
}
.t-title{
    font-size:13px;
    margin:10px;
    font-weight:600;
}
.t-row{
    display:flex;
    width:100%;
    height:30px;
    justify-content:flex-start;align-items:center;
}
.t-col{
    height:100%;
    width:20%;
    padding:3px 6px;
    display:flex;justify-content:center;align-items:center;
}
.t-col-left{
    justify-content:flex-start;
}
.t-col-right{
    justify-content:flex-end;
}
.t-hline{
    width:100%;
    height:1px;
    background:lightgray;
    margin:6px 0px;
}
</style>