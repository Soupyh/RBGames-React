import { Link } from 'react-router-dom'

export default function ProductCard({ p }){
  // Normalizar ruta: si viene desde "public" como "/assets/..." Vite lo sirve desde la raíz.
  const base = import.meta.env.BASE_URL || '/'
  const src = p.image && p.image.startsWith('/') ? `${base.replace(/\/$/, '')}${p.image}` : p.image
  const fallbackSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='180'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='50%' fill='%23333333' font-size='18' font-family='Arial,Helvetica,sans-serif' dominant-baseline='middle' text-anchor='middle'>Imagen no disponible</text></svg>`
  const fallback = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackSvg)}`

  return (
    <div className="card h-100">
      <img src={src || fallback} onError={(e)=>{ if(!e.currentTarget.dataset.failed){ e.currentTarget.dataset.failed = '1'; e.currentTarget.src = fallback } }} className="card-img-top" alt={p.name || 'Juego'} style={{objectFit:'cover',height:180,backgroundColor:'#f0f0f0'}} />
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
