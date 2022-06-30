const map = new Map()
const set = (key, val)=>{
  map.set(key, val)
}
const get = (key)=>{
  return map.get(key)
}

module.exports = {
  set,
  get
}