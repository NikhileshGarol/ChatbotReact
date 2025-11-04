import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingOverlay from "./LoadingOverlay";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const { isAuthenticated, token, loading } = useAuth();
  const location = useLocation();

  // Wait until auth state is restored from localStorage
  if (loading) {
    return <LoadingOverlay loading={loading} />; // show a spinner or blank screen
  }

  // Once loaded, check if token exists
  if (!isAuthenticated && !token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
