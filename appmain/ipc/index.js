const {ipcMain} = require('electron')

const functions = require('./functions')

//통신 모듈
ipcMain.on('sendApp', (e, arg) => {
    
  const item = JSON.parse(arg)
  console.log('sendApp start', item);

  const func = functions[item.command];
  if(func){
      console.log('sendApp func');
      const resdata = func(item.arg)
      console.log('resdata',resdata)
      e.reply('fromApp', JSON.stringify({id:item.id, data:resdata}))
      console.log('fromApp replied')
  }else{
      console.warn(item.command+' is not found in the apps')
  }

  console.log('sendApp end');
})
