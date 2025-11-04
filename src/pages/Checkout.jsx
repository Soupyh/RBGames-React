import { useNavigate } from 'react-router-dom'

export default function Checkout(){
  const nav = useNavigate()
  function pagar(e){
    e.preventDefault()
    const ok = Math.random() > 0.2
    localStorage.setItem('cart', '[]')
    nav(ok? '/compra-exitosa':'/compra-error')
  }
  return (
    <form className="row g-3" onSubmit={pagar}>
      <h1 className="mb-3">Checkout</h1>
      <div className="col-md-6">
        <label className="form-label">Nombre</label>
        <input className="form-control" required />
      </div>
      <div className="col-md-6">
        <label className="form-label">Email</label>
        <input type="email" className="form-control" required />
      </div>
      <div className="col-12">
        <label className="form-label">Dirección</label>
        <input className="form-control" required />
      </div>
      <div className="col-12">
        <button className="btn btn-primary">Pagar</button>
      </div>
    </form>
  )
}