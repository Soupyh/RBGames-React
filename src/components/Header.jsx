import { Link, NavLink, useNavigate } from 'react-router-dom'
import { getSession, logout, isAdmin } from '../data/auth'

export default function Header(){
  const ses = getSession();
  const nav = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <span className="sf-brand">RB Games</span>
        </Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink to="/" className="nav-link">Tienda</NavLink></li>
            <li className="nav-item"><NavLink to="/categorias" className="nav-link">Categorías</NavLink></li>
            <li className="nav-item"><NavLink to="/nosotros" className="nav-link">Nosotros</NavLink></li>
            <li className="nav-item"><NavLink to="/soporte" className="nav-link">Soporte</NavLink></li>
          </ul>
          <div className="d-flex gap-2">
  <div className="d-flex gap-2">
  <NavLink to="/carrito" className="btn btn-outline-light">Carrito</NavLink>
  {ses ? (
    <>
      {isAdmin() ? (
        <NavLink to="/admin" className="btn btn-outline-light">Admin</NavLink>
      ) : (
        <NavLink to="/cuenta" className="btn btn-outline-light">Mi cuenta</NavLink>
      )}
      <button className="btn btn-primary" onClick={()=>{ logout(); nav('/'); }}>Salir</button>
    </>
  ) : (
    <>
      <NavLink to="/login" className="btn btn-outline-light">Ingresar</NavLink>
      <NavLink to="/registro" className="btn btn-primary">Registrarse</NavLink>
    </>
  )}
</div>
          </div>
        </div>
      </div>
    </nav>
  )
}
