import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

type Props = {
  allowed: Array<'superadmin' | 'admin' | 'user'>;
  children: React.ReactElement;
};

const RoleGuard: React.FC<Props> = ({ allowed, children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // ProtectedRoute should redirect; in case it's reached, also redirect to login
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  const role = user.role ?? 'user';

  // superadmin has widest permissions: only allow if explicitly listed.
  if (!allowed.includes(role as any)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
};

export default RoleGuard;
