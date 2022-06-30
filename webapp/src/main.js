import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

//app <-> web interface
const appRequests = {}
Vue.prototype.$sendToApp = (command, arg, vm, callback) => {
  const id = 'req-'+new Date().getTime()
  const req = {id:id, command:command, arg:arg, vm:vm, callback:callback}
  appRequests[req.id] = req;
  window.app.send('sendApp', {id:id, command:command, arg:arg})
}

window.app.on('fromApp', (e, arg) => {
  
  console.log('fromApp start', arg)
  const res = JSON.parse(arg)
  const req = appRequests[res.id];
  
  if(req){
    console.log('fromApp req start ', req)
    const vm = req.vm;
    const callback = req.callback;
    delete appRequests[res.id];
    if(callback){
      callback.call(vm, res.data)
    }
  }else{
    console.warn('req id: '+res.id)
  }

})

new Vue({
  render: h => h(App),
}).$mount('#app')
