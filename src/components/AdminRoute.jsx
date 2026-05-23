import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute({ children }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
