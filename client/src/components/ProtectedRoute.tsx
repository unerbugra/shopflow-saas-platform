import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type UserRole = 'admin' | 'customer';


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}



const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Yükleniyor, lütfen bekleyin</h3>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as UserRole)) {

    return <Navigate to="/unauthorized" replace={true} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;