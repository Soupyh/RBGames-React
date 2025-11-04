const KEY = 'rbgames_products'

function _ensure(){
  if(!localStorage.getItem(KEY)) localStorage.setItem(KEY, JSON.stringify([]))
}

export function list(){ _ensure(); return JSON.parse(localStorage.getItem(KEY)) }
export function create(p){ _ensure(); const arr = list(); arr.push(p); localStorage.setItem(KEY, JSON.stringify(arr)); return p }
export function update(id, patch){
  const arr = list(); const idx = arr.findIndex(x=>x.id===id)
  if(idx>=0){ arr[idx] = { ...arr[idx], ...patch }; localStorage.setItem(KEY, JSON.stringify(arr)); return arr[idx] }
  return null
}
export function remove(id){ const arr = list().filter(x=>x.id!==id); localStorage.setItem(KEY, JSON.stringify(arr)); }
export function seedIfEmpty(seed){ if(list().length===0){ localStorage.setItem(KEY, JSON.stringify(seed)) } }