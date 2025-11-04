import { useMemo, useState } from 'react'
import { list } from '../data/persistence'
import CategoryPill from '../components/CategoryPill'
import ProductCard from '../components/ProductCard'

export default function Categorias(){
  const items = list()
  const cats = useMemo(()=> Array.from(new Set(items.map(p=>p.category))).sort(), [items])
  const [active, setActive] = useState(null)
  const filtered = active? items.filter(p=>p.category===active) : items

  return (
    <>
      <h1 className="mb-3">Categorías</h1>
      <div className="mb-3">
        <CategoryPill name="Todas" active={!active} onClick={()=>setActive(null)} />
        {cats.map(c=> <CategoryPill key={c} name={c} active={active===c} onClick={()=>setActive(c)} />)}
      </div>
      <div className="row g-3">
        {filtered.map(p=> (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <ProductCard p={p} />
          </div>
        ))}
      </div>
    </>
  )
}