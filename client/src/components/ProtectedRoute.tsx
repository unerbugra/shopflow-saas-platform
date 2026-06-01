import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 1. TypeScript için Props tipini tanımlıyoruz
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // 2. Context'ten güncel kullanıcı durumunu ve yüklenme aşamasını çekiyoruz
  const { user, loading } = useAuth();

  // 3. SENARYO 1: Backend'den token doğrulaması henüz gelmediyse (Yükleniyorsa)
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <h3>Yükleniyor, lütfen bekleyin şef...</h3>
      </div>
    );
  }

  // 4. SENARYO 2: Yüklenme bitti ama içeride kullanıcı falan yoksa (Kaçak giriş)
  if (!user) {
    // replace={true} diyerek tarayıcı geçmişini temizliyoruz ki geri butonuna basınca döngüye girmesin
    return <Navigate to="/login" replace={true} />;
  }

  // 5. SENARYO 3: Her şey temiz, kullanıcı giriş yapmış! Kapıyı açıyoruz:
  return <>{children}</>;
};

export default ProtectedRoute;