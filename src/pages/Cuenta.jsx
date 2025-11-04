import { getSession } from '../data/auth'

export default function Cuenta(){
  const ses = getSession();
  if(!ses) return <p>No hay sesión activa.</p>
  return (
    <div className="row g-4">
      <div className="col-md-5">
        <div className="card p-3">
          <h3 className="mb-2">Mi perfil</h3>
          <div><strong>Nombre:</strong> {ses.name || '—'}</div>
          <div><strong>Email:</strong> {ses.email}</div>
          <div><strong>Rol:</strong> {ses.role}</div>
        </div>
      </div>
      <div className="col-md-7">
        <div className="card p-3">
          <h3 className="mb-2">Mis compras</h3>
          <p className="text-muted mb-0">Aún no tienes compras registradas. (placeholder)</p>
        </div>
      </div>
    </div>
  )
}