import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '', // Şifre eşleşme kontrolü için UX detayı
    phone: '',
    address: ''
  });

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Dinamik input takibi (Tek tek state açmak yerine en temizi)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    // Ön Güvenlik: Şifreler eşleşiyor mu?
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Girdiğiniz şifreler birbiriyle eşleşmiyor şef!');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await axios.post('/api/auth/register', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address
      });
      
      console.log('Register Success:', response.data);
      
      // Backend'den artık token ve user döndüğü için anında login yaptırıyoruz!
      login(response.data.user, response.data.token);
      navigate('/'); // Giriş başarılı, doğrudan Dashboard'a!
      
    } catch (error: any) {
      console.error('Register Error:', error.response?.data || error.message);
      setErrorMsg(error.response?.data?.message || 'Kayıt esnasında bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        
        {/* Başlık Alanı */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md shadow-indigo-200">
            S
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopflow'a Kayıt Ol
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Yönetim panelinizi oluşturmak için bilgilerinizi girin.
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
          
          {/* İsim & Soyisim (Yan Yana Grid) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Ad</label>
              <input
                name="first_name"
                type="text"
                required
                value={formData.first_name}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Ahmet"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Soyad</label>
              <input
                name="last_name"
                type="text"
                required
                value={formData.last_name}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="Yılmaz"
              />
            </div>
          </div>

          {/* E-posta & Telefon (Yan Yana Grid) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">E-posta Adresi</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="ahmet@shopflow.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Telefon Numarası</label>
              <input
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="0555XXXXXXX"
              />
            </div>
          </div>

          {/* Şifre & Şifre Tekrar (Yan Yana Grid) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Şifre</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Şifre Tekrar</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none block w-full px-4 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Adres Alanı (Textarea) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Adres (Opsiyonel)</label>
            <textarea
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="appearance-none block w-full px-4 py-2.5 border border-slate-200 rounded-xl placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
              placeholder="Şirket veya fatura adresi..."
            />
          </div>

          {/* Kayıt Ol Butonu */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 shadow-md shadow-indigo-100 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Hesap Oluşturuluyor...' : 'Kayıt Ol ve Başla'}
            </button>
          </div>

          {/* Login Sayfasına Geçiş Linki */}
          <div className="text-center text-sm text-slate-500 mt-4">
            Zaten bir hesabınız var mı?{' '}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Giriş Yap
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}