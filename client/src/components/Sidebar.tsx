import { Link, useLocation } from 'react-router-dom';
import LogoutModal from './Logout';
import { useState } from 'react';



export default function Sidebar() {
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  }

  const menuItems = [
    { name: 'Dashboard', icon: '📊', path: '/' },
    { name: 'Siparişler', icon: '📦', path: '/orders' },
    { name: 'Ürünler', icon: '🏷️', path: '/products' },
    { name: 'Müşteriler', icon: '👥', path: '/customers' },
    { name: 'Kampanyalar', icon: '🚀', path: '/campaigns' },
    { name: 'Ayarlar', icon: '⚙️', path: '/settings' },
    { name: 'Çıkış Yap', icon: '🚪' },

  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 p-6 z-10">
      <div className="text-[#ff6000] text-2xl font-black mb-10 px-3 tracking-tighter">
        HEPSİBURADA <span className="text-gray-400 text-sm font-normal">satıcı</span>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {

          if (!item.path) {
            return (
              <button
                key={item.name}
                onClick={handleLogoutClick}
                className="flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              >
                <span className="text-xl">{item.icon}</span>
                {item.name}
              </button>
            );
          }

          return(
          <Link
            key={item.name}
            
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-xl font-medium transition-all duration-200 ${
              location.pathname === item.path
                ? 'bg-orange-50 text-[#ff6000] shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {item.name}
          </Link>
         );
})}

        
        
          

        
      </nav>
          <LogoutModal isOpen={isLogoutModalOpen} onClose={() => setIsLogoutModalOpen(false)} />
      
    </aside>
  );
}