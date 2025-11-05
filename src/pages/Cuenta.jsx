import { useState, useMemo } from 'react'
import { getSession, updateProfile } from '../data/auth'

export default function Cuenta(){
  const [refresh, setRefresh] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  // 'ses' se actualiza cada vez que 'refresh' cambia
  const ses = useMemo(() => getSession(), [refresh]);

  if(!ses) return <p>No hay sesión activa.</p>

  function handleEdit() {
    setFormData({
      name: ses.name || '',
      email: ses.email || ''
    });
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // --- FUNCIÓN MODIFICADA (ya no es 'async') ---
  function handleSubmit(e) {
    e.preventDefault();
    
    // Llamamos a la función de 'auth.js' (que ahora es síncrona)
    const r = updateProfile(ses.email, {
      name: formData.name,
      email: formData.email
    });

    if (r.ok) {
      alert('Perfil actualizado con éxito');
      setIsEditing(false);
      setRefresh(x => x + 1); // Forzamos la recarga de la sesión
    } else {
      alert(r.error || 'No se pudo actualizar el perfil.');
    }
  }

  return (
    <div className="row g-4">
      <div className="col-md-5">
        <div className="card p-3 text-light">
          
          {isEditing ? (
            // --- Formulario de Edición (ya no tiene 'disabled') ---
            <form onSubmit={handleSubmit}>
              <h3 className="mb-3">Editar perfil</h3>
              <div className="mb-2">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">
                  Guardar
                </button>
                <button type="button" className="btn btn-outline-light" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            // --- Vista de Datos ---
            <>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h3 className="mb-0">Mi perfil</h3>
                <button className="btn btn-sm btn-outline-light" onClick={handleEdit}> Editar perfil</button>
              </div>
              <div><strong>Nombre:</strong> {ses.name || '—'}</div>
              <div><strong>Email:</strong> {ses.email}</div>
              <div><strong>Rol:</strong> {ses.role}</div>
            </>
          )}

        </div>
      </div>
      <div className="col-md-7">
        <div className="card p-3 text-light">
          <h3 className="mb-2">Mis compras</h3>
          <p className="text-light">Aún no tienes compras registradas. (placeholder)</p>
        </div>
      </div>
    </div>
  )
}