import { Link } from 'react-router-dom'

export default function ProductCard({ p }){
  return (
    <div className="card h-100">
      <img src={p.image} className="card-img-top" alt={p.name} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{p.name}</h5>
        <p className="card-text mb-3">${p.price.toLocaleString('es-CL')}</p>
        <div className="mt-auto d-flex gap-2">
          <Link to={`/producto/${p.id}`} className="btn btn-outline-light">Ver</Link>
          <button className="btn btn-primary" onClick={() => {
            const cart = JSON.parse(localStorage.getItem('cart')||'[]')
            cart.push({ id:p.id, qty:1 })
            localStorage.setItem('cart', JSON.stringify(cart))
            alert('Agregado al carrito')
          }}>Agregar</button>
        </div>
      </div>
    </div>
  )
}