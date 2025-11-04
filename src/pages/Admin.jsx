import { useMemo, useState } from 'react'
import { list, create, update, remove } from '../data/persistence'
import { listUsers, createUser, setRole, removeUser, resetPassword } from '../data/auth'
import { getSession } from '../data/auth'

export default function Admin(){
  const [tab, setTab] = useState('productos') // 'productos' | 'usuarios'
  const [refresh, setRefresh] = useState(0)
  const items = useMemo(()=> list(), [refresh])
  const users = useMemo(()=> listUsers(), [refresh])
  const ses = getSession()

  // ==== Productos (igual que tu versión, con pequeño refactor) ====
  function agregarProducto(e){
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    create({
      id: form.get('id'),
      name: form.get('name'),
      price: Number(form.get('price')||0),
      image: form.get('image')||'/logo.svg',
      category: form.get('category')||'General'
    })
    setRefresh(x=>x+1)
    e.currentTarget.reset()
  }

  // ==== Usuarios ====
  function agregarUsuario(e){
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const email = f.get('email')?.toString().trim()
    const pass  = f.get('pass')?.toString()
    const name  = f.get('name')?.toString().trim()
    const role  = f.get('role')?.toString() || 'USER'
    const r = createUser({ email, pass, name, role })
    if(!r.ok){ alert(r.error || 'No se pudo crear'); return }
    setRefresh(x=>x+1)
    e.currentTarget.reset()
  }

  function cambiarRol(email, role){
    const r = setRole(email, role)
    if(!r.ok) return alert(r.error || 'No se pudo cambiar el rol')
    setRefresh(x=>x+1)
  }

  function eliminarUsuario(email){
    if (ses?.email === email) return alert('No puedes eliminar tu propia cuenta activa')
    if(!confirm(`¿Eliminar usuario ${email}?`)) return
    removeUser(email)
    setRefresh(x=>x+1)
  }

  function cambiarPass(email){
    const p = prompt('Nueva contraseña para ' + email)
    if(!p) return
    const r = resetPassword(email, p)
    if(!r.ok) return alert(r.error || 'No se pudo cambiar la contraseña')
    alert('Contraseña actualizada')
  }

  return (
    <div className="vstack gap-4">
      <header className="d-flex align-items-center gap-3">
        <h1 className="mb-0">Panel Admin</h1>
        <div className="btn-group">
          <button className={`btn btn-sm ${tab==='productos'?'btn-primary':'btn-outline-light'}`} onClick={()=>setTab('productos')}>Productos</button>
          <button className={`btn btn-sm ${tab==='usuarios'?'btn-primary':'btn-outline-light'}`} onClick={()=>setTab('usuarios')}>Usuarios</button>
        </div>
      </header>

      {tab === 'productos' ? (
        <div className="row g-4">
          <div className="col-md-5">
            <h2 className="h4 mb-3">Nuevo producto</h2>
            <form className="vstack gap-2" onSubmit={agregarProducto}>
              <input name="id" className="form-control" placeholder="ID (único)" required />
              <input name="name" className="form-control" placeholder="Nombre" required />
              <input name="price" type="number" className="form-control" placeholder="Precio" required />
              <input name="image" className="form-control" placeholder="URL imagen" />
              <input name="category" className="form-control" placeholder="Categoría" />
              <button className="btn btn-primary">Agregar</button>
            </form>
          </div>
          <div className="col-md-7">
            <h2 className="h4 mb-3">Listado</h2>
            <table className="table table-dark table-striped align-middle">
              <thead><tr><th>ID</th><th>Nombre</th><th>Precio</th><th></th></tr></thead>
              <tbody>
                {items.map(p=> (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>${p.price.toLocaleString('es-CL')}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-light me-2" onClick={()=>{ update(p.id,{ price:p.price+1000 }); setRefresh(x=>x+1) }}>+$1.000</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>{ remove(p.id); setRefresh(x=>x+1) }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-md-5">
            <h2 className="h4 mb-3">Nuevo usuario</h2>
            <form className="vstack gap-2" onSubmit={agregarUsuario}>
              <input name="name" className="form-control" placeholder="Nombre" />
              <input name="email" type="email" className="form-control" placeholder="Email" required />
              <input name="pass" type="password" className="form-control" placeholder="Contraseña" required />
              <select name="role" className="form-select">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <button className="btn btn-primary">Crear usuario</button>
            </form>
          </div>
          <div className="col-md-7">
            <h2 className="h4 mb-3">Usuarios</h2>
            <table className="table table-dark table-striped align-middle">
              <thead>
                <tr><th>Email</th><th>Nombre</th><th>Rol</th><th style={{width:220}}></th></tr>
              </thead>
              <tbody>
                {users.map(u=> (
                  <tr key={u.email}>
                    <td>{u.email}</td>
                    <td>{u.name || '—'}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className={`btn ${u.role==='USER' ? 'btn-primary' : 'btn-outline-light'}`}
                          onClick={()=>cambiarRol(u.email, 'USER')}
                        >USER</button>
                        <button
                          className={`btn ${u.role==='ADMIN' ? 'btn-primary' : 'btn-outline-light'}`}
                          onClick={()=>cambiarRol(u.email, 'ADMIN')}
                        >ADMIN</button>
                      </div>
                    </td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-light me-2" onClick={()=>cambiarPass(u.email)}>Reset pass</button>
                      <button className="btn btn-sm btn-danger" onClick={()=>eliminarUsuario(u.email)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
                {users.length===0 && (
                  <tr><td colSpan={4} className="text-center text-muted py-4">Sin usuarios</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
