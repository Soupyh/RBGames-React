//
// EN: src/pages/Soporte.jsx (REEMPLAZA todo el archivo)
//
import { useState, useEffect } from 'react';
import { getSession } from '../data/auth'; // Para auto-rellenar el email
import LogoRbGames from "../assets/IMG/LogoRbGames.png";

export default function Soporte() {
  const [formData, setFormData] = useState({
    email: '',
    asunto: '',
    descripcion: '',
  });
  const [enviado, setEnviado] = useState(false);
  const ses = getSession();

  // Efecto para cargar el email del usuario si está logueado
  useEffect(() => {
    if (ses && ses.email) {
      setFormData(prev => ({ ...prev, email: ses.email }));
    }
  }, [ses]);

  // Manejador para los inputs del formulario
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  // Manejador para enviar el formulario
  function handleSubmit(e) {
    e.preventDefault();

    // 1. Crear el objeto del ticket
    const newTicket = {
      id: Date.now(), // ID único basado en la fecha
      fecha: new Date().toLocaleString('es-CL'),
      status: 'abierto', // Estado inicial
      email: formData.email,
      asunto: formData.asunto,
      descripcion: formData.descripcion,
    };

    // 2. Cargar tickets existentes de localStorage (o un array vacío)
    const tickets = JSON.parse(localStorage.getItem('tickets') || '[]');

    // 3. Agregar el nuevo ticket
    tickets.push(newTicket);

    // 4. Guardar la lista actualizada en localStorage
    localStorage.setItem('tickets', JSON.stringify(tickets));

    // 5. Mostrar mensaje de éxito y limpiar formulario
    setEnviado(true);
    setFormData({
      email: ses ? ses.email : '', // Resetear con el email de sesión
      asunto: '',
      descripcion: '',
    });
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 text-light">
          
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h1 className="mb-0">Contacto y Soporte</h1>
              <p className="lead mb-0">Por favor, completa el formulario para crear un ticket de soporte.</p>
            </div>
            <img src={LogoRbGames} alt="Logo RBGames" style={{width:72, height:'auto'}} className="ms-3 d-none d-md-block" />
          </div>
          {/* Mensaje de éxito */}
          {enviado && (
            <div className="alert alert-success" role="alert">
              ¡Tu ticket ha sido enviado! El equipo de soporte se 
              contactará contigo a la brevedad.
            </div>
          )}

          <p className="lead">
            Por favor, completa el formulario para crear un ticket de soporte.
          </p>

          {/* Formulario de Ticket */}
          <form className="vstack gap-3" onSubmit={handleSubmit}>
            <div>
              <label className="form-label">Tu Email de Contacto</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Asunto</label>
              <input
                type="text"
                name="asunto"
                className="form-control"
                value={formData.asunto}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="form-label">Descripción del Problema</label>
              <textarea
                name="descripcion"
                className="form-control"
                rows="5"
                value={formData.descripcion}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Enviar Ticket
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}