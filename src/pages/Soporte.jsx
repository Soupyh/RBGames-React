import React from 'react';

export default function Soporte() {
  return (
    // Usamos las clases de Bootstrap que ya tienes
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8 text-light"> {/* Asumo que tu fondo es oscuro */}
          
          <h1 className="mb-3">Contacto y Soporte</h1>
          
          <p className="lead">
            ¿Tienes problemas con tu cuenta, una compra o alguna duda sobre 
            nuestros productos?
          </p>
          <p>
            Estamos aquí para ayudarte. La forma más rápida de contactarnos 
            es a través de nuestro correo electrónico de soporte.
          </p>

          <div className="mt-4">
            <p><strong>Email de Soporte:</strong></p>
            {/* Este es un enlace "admin:". Al hacer clic,
              abrirá el cliente de correo del usuario (Outlook, Mail, etc.)
              listo para escribir a esa dirección.
            */}
            <a 
              href="admin@rbgames.com" // <-- Cambia esto por tu email real
              className="btn btn-primary"
            >
              Enviar un email a soporte@rbgames.com
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}