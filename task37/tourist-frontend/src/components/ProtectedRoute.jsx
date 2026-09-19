import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false, guideOnly = false }) {
  const { user } = useAuth();

  if (user === undefined) {
    return <div className="page center-spinner"><Loader2 className="spin" size={24} aria-label="Loading account" /></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  if (guideOnly && user.role !== 'guide') {
    return <Navigate to="/" replace />;
  }

  return children;
}
