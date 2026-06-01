import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Hata mesajı için şık bir state
  const [isSubmitting, setIsSubmitting] = useState(false); // Buton kilitleme state'i

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/auth/login', {
        email,
        password 
      });
      
      console.log('Success:', response.data);
      
      login(response.data.user, response.data.token);
      navigate('/');
    } catch (error: any) {
      console.error('Error:', error.response?.data || error.message);
      // Backend'den gelen hata mesajını veya genel bir mesajı ekrana basıyoruz
      setErrorMsg(error.response?.data?.message || 'Giriş yapılırken bir hata oluştu şef.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Logo ve Başlık Alanı */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-indigo-200">
            S
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopflow'a Giriş Yap
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Sipariş ve yönetim panelinize erişmek için bilgilerinizi girin.
          </p>
        </div>

        {/* Hata Mesajı Paneli */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-pulse">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Form Alanı */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Alanı */}
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold text-slate-700 mb-1">
                E-posta Adresi
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm"
                placeholder="ornek@shopflow.com"
              />
            </div>

            {/* Şifre Alanı */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1">
                Şifre
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Beni Hatırla & Şifremi Unuttum (UX Detayı) */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-slate-500">
                Beni hatırla
              </label>
            </div>

            <div className="text-xs">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Şifremi unuttum?
              </a>
            </div>
          </div>

          {/* Giriş Yap Butonu */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 shadow-md shadow-indigo-100 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Kontrol ediliyor...</span>
                </div>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </div>
        </form>
        <div className="text-center text-sm text-slate-500 mt-4">
  Henüz bir hesabınız yok mu?{' '}
  <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
    Hemen Kayıt Ol
  </Link>
</div>
      </div>
    </div>
  );
}