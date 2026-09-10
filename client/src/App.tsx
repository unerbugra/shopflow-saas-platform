import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Campaigns from './pages/Campaigns';
import Settings from './pages/Settings';
import LoginForm from './components/Login';
import ProtectedRoute from './components/ProtectedRoute'; // 2. Koruma kalkanını import ettik
import { AuthProvider, useAuth } from './context/AuthContext'; 
import RegisterForm from './components/Register';
import CustomerStorefront from './pages/CustomerStorefront';
import Unauthorized from './pages/Unauthorized'; // Yetkisiz erişim sayfasını import ettik
import CustomerSidebar from './components/CustomerSidebar';

// Rotaları ve Sidebar görünümünü Context'e göre yöneteceğimiz ana gövde
function AppContent() {
  const { user } = useAuth(); // Güncel giriş durumunu kontrol ediyoruz

  return (
    <div className="flex w-full min-h-screen bg-gray-50 text-gray-900">
      {/* 3. KRİTİK DOKUNUŞ: Kullanıcı giriş yapmadıysa Sidebar'ı tamamen gizle */}
      {user && user.role === 'admin' && <Sidebar />}
      {user && user.role === 'customer' && <CustomerSidebar />}

      {/* Eğer kullanıcı giriş yapmadıysa, menü gizlendiği için pl-64 (sol boşluk) kalkmalı */}
      <div className={`flex-1 w-full ${user ? 'pl-64' : ''}`}> 
        <Routes>
          {/* Herkese açık (Public) Rota */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} /> {/* Yetkisiz erişim sayfası */}

          {/* Korumalı (Protected) Rotalar */}
          <Route path="/" element={<ProtectedRoute allowedRoles={['admin']}><Dashboard /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['admin']}><Orders /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute allowedRoles={['admin']}><Products /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute allowedRoles={['admin']}><Customers /></ProtectedRoute>} />
          <Route path="/campaigns" element={<ProtectedRoute allowedRoles={['admin']}><Campaigns /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
          <Route path="/store" element={<ProtectedRoute allowedRoles={['admin','customer']}><CustomerStorefront /></ProtectedRoute>} /> 

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;