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

// Rotaları ve Sidebar görünümünü Context'e göre yöneteceğimiz ana gövde
function AppContent() {
  const { user } = useAuth(); // Güncel giriş durumunu kontrol ediyoruz

  return (
    <div className="flex w-full min-h-screen bg-gray-50 text-gray-900">
      {/* 3. KRİTİK DOKUNUŞ: Kullanıcı giriş yapmadıysa Sidebar'ı tamamen gizle */}
      {user && <Sidebar />}

      {/* Eğer kullanıcı giriş yapmadıysa, menü gizlendiği için pl-64 (sol boşluk) kalkmalı */}
      <div className={`flex-1 w-full ${user ? 'pl-64' : ''}`}> 
        <Routes>
          {/* Herkese açık (Public) Rota */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Korumalı (Protected) Rotalar */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
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