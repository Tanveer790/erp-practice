import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../core/AuthContext.jsx';
import { LoadingOverlay } from './LoadingOverlay.jsx';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingOverlay />;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
