import { Link } from "react-router-dom";
import { list } from "../data/persistence";

export default function Carrito() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const items = list();
  const detalle = cart.map((it) => ({
    ...items.find((p) => p.id === it.id),
    qty: it.qty,
  }));
  const total = detalle.reduce((s, x) => s + x.price * x.qty, 0);
  return (
    <>
      <h1 className="mb-3">Carrito</h1>
      {detalle.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {detalle.map((d) => (
              <li
                key={d.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{d.name}</span>
                <span>${(d.price * d.qty).toLocaleString("es-CL")}</span>
              </li>
            ))}
          </ul>
          <div className="d-flex justify-content-between align-items-center">
            <strong>Total</strong>
            <strong>${total.toLocaleString("es-CL")}</strong>
          </div>
          <div className="mt-3 d-flex align-items-center gap-2 flex-wrap">
            <Link to="/checkout" className="btn btn-success">
              Continuar a Checkout
            </Link>

            <Link to="/" className="btn btn-secondary">Seguir Comprando</Link>

            <button className="btn btn-primary" onClick={() => {localStorage.removeItem('cart'); window.location.reload();}}>Vaciar Carrito</button>
          </div>
        </>
      )}
    </>
  );
}
