import { useParams, Link } from 'react-router-dom'
import { list } from '../data/persistence'

export default function ProductoDetalle(){
  const { id } = useParams()
  const p = list().find(x=>x.id===id)
  if(!p) return <p>Producto no encontrado.</p>
  return (
    <div className="row g-4">
      <div className="col-md-5"><img src={p.image} className="img-fluid rounded" alt={p.name}/></div>
      <div className="col-md-7">
        <h1>{p.name}</h1>
        <p className="text-muted">Categoría: {p.category}</p>
        <h3 className="my-3">${p.price.toLocaleString('es-CL')}</h3>
        <button className="btn btn-primary me-2" onClick={()=>{
          const cart = JSON.parse(localStorage.getItem('cart')||'[]')
          cart.push({ id:p.id, qty:1 });
          localStorage.setItem('cart', JSON.stringify(cart));
          alert('Agregado al carrito')
        }}>Agregar al carrito</button>
        <Link to="/checkout" className="btn btn-outline-light">Ir a pagar</Link>
      </div>
    </div>
  )
}