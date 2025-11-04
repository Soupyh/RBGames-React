import { useEffect, useState } from 'react'
import { products as seed } from '../data/products'
import { seedIfEmpty, list } from '../data/persistence'
import ProductCard from '../components/ProductCard'

export default function Home(){
  const [items, setItems] = useState([])
  useEffect(()=>{ seedIfEmpty(seed); setItems(list()) }, [])
  return (
    <>
      <h1 className="mb-4">Tienda</h1>
      <div className="row g-3">
        {items.map(p=> (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </>
  )
}