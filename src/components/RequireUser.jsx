import { Navigate, useLocation } from 'react-router-dom'
import { isUser } from '../data/auth'

export default function RequireUser({ children }){
  const loc = useLocation();
  return isUser() ? children : <Navigate to="/login" state={{ from: loc }} replace />;
}