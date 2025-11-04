import { Link } from 'react-router-dom'
export default function CompraExitosa(){
  return (
    <div className="text-center py-5">
      <h1>¡Compra exitosa!</h1>
      <p>Gracias por tu compra.</p>
      <Link to="/" className="btn btn-primary">Volver a la tienda</Link>
    </div>
  )
}