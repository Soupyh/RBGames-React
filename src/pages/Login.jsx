import { useNavigate } from 'react-router-dom'
import { login } from '../data/auth'
import { useState } from 'react'

export default function Login(){
  const nav = useNavigate()
  const [err, setErr] = useState('')
  const [email, setEmail] = useState('')   // ← controlados (vacíos)
  const [pass, setPass] = useState('')

  function onSubmit(e){
    e.preventDefault()
    const ses = login(email.trim(), pass)
    if (!ses) { setErr('Credenciales inválidas'); return }

    // limpia campos antes de salir
    setEmail('')
    setPass('')
    setErr('')

    // navega según rol
    nav(ses.role === 'ADMIN' ? '/admin' : '/cuenta')
  }

  return (
    <div className="col-md-5 mx-auto">
      <h1 className="mb-3">Ingresar</h1>
      {err && <div className="alert alert-danger py-2">{err}</div>}

      <form className="vstack gap-3" onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          className="form-control"
          placeholder="Email"
          value={email} onChange={(e)=>setEmail(e.target.value)}
        />
        <input
          name="pass"
          type="password"
          className="form-control"
          placeholder="Contraseña"
          value={pass} onChange={(e)=>setPass(e.target.value)}
        />
        <button className="btn btn-primary">Entrar</button>
      </form>
    </div>
  )
}
