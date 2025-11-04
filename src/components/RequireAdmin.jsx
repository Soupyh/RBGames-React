import { Navigate, useLocation } from 'react-router-dom'
import { isAdmin } from '../data/auth'

export default function RequireAdmin({ children }){
  const loc = useLocation();
  return isAdmin() ? children : <Navigate to="/login" state={{ from: loc }} replace />;
}