import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Categorias from './pages/Categorias'
import ProductoDetalle from './pages/ProductoDetalle'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import CompraExitosa from './pages/CompraExitosa'
import CompraError from './pages/CompraError'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Cuenta from './pages/Cuenta'
import RequireAdmin from './components/RequireAdmin'
import RequireUser from './components/RequireUser'
import Register from './pages/Register'
import Nosotros from './pages/Nosotros'
import Soporte from './pages/Soporte'

export default function Router(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/categorias" element={<Categorias/>} />
      <Route path="/producto/:id" element={<ProductoDetalle/>} />
      <Route path="/carrito" element={<Carrito/>} />
      <Route path="/checkout" element={<Checkout/>} />
      <Route path="/compra-exitosa" element={<CompraExitosa/>} />
      <Route path="/compra-error" element={<CompraError/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/admin" element={<RequireAdmin><Admin/></RequireAdmin>} />
      <Route path="/cuenta" element={<RequireUser><Cuenta/></RequireUser>} />
      <Route path="/registro" element={<Register/>} />
      <Route path="/nosotros" element={<Nosotros/>} />
      <Route path="/soporte" element={<Soporte/>} />
    </Routes>
  )
}