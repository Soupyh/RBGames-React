import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../data/auth'

export default function Register(){
  const nav = useNavigate()
  const [err, setErr] = useState('')
  const [ok, setOk] = useState('')

  function onSubmit(e){
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const name = f.get('name')?.toString().trim()
    const email = f.get('email')?.toString().trim()
    const pass = f.get('pass')?.toString()
    const pass2 = f.get('pass2')?.toString()

    if(!name || !email || !pass || !pass2){
      setErr('Completa todos los campos'); setOk(''); return
    }
    if(pass !== pass2){
      setErr('Las contraseñas no coinciden'); setOk(''); return
    }

    const r = register({ name, email, pass, role:'USER' })
    if(!r.ok){
      setErr(r.error || 'No se pudo registrar'); setOk(''); return
    }
    setOk('Cuenta creada. Redirigiendo…'); setErr('')
    setTimeout(()=> nav('/cuenta'), 600)
  }

  return (
    <div className="col-md-6 mx-auto">
      <h1 className="mb-3">Crear cuenta</h1>
      {err && <div className="alert alert-danger py-2">{err}</div>}
      {ok && <div className="alert alert-success py-2">{ok}</div>}

      <form className="vstack gap-3" onSubmit={onSubmit}>
        <input name="name" className="form-control" placeholder="Nombre completo" />
        <input name="email" type="email" className="form-control" placeholder="Email" />
        <input name="pass" type="password" className="form-control" placeholder="Contraseña" />
        <input name="pass2" type="password" className="form-control" placeholder="Repetir contraseña" />
        <button className="btn btn-primary">Registrarme</button>
      </form>

      <p className="text-muted small mt-3">
        Al registrarte, aceptas los términos y condiciones (placeholder).
      </p>
    </div>
  )
}
