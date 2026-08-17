import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('token');

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-9 h-9 rounded-full border-3 animate-spin"
            style={{ borderColor: 'var(--blue-light)', borderTopColor: 'var(--blue)' }}
          />
          <p className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Loading Hirely...</p>
        </div>
      </div>
    );
  }

  // If user has active authentication or valid session token, bypass public screens directly to dashboard
  if (isAuthenticated || hasToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
