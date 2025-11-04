import { Link } from 'react-router-dom'
export default function CompraError(){
  return (
    <div className="text-center py-5">
      <h1>No se pudo procesar el pago</h1>
      <p>Intenta nuevamente.</p>
      <Link to="/checkout" className="btn btn-primary">Volver a pagar</Link>
    </div>
  )
}