import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react'; 

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, tokenData: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('shopflow_token');
      const storedUser = localStorage.getItem('shopflow_user');

      // Eğer lokalde bilgi yoksa direkt loading'i kapat ve bitir
      if (!storedToken || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        // Backend'e token'ın hala geçerli olup olmadığını soruyoruz
        // NOT: Kendi axios instance'ını veya fetch yapını proje mimarine göre güncelleyebilirsin şef
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json(); // Backend güncel user verisini dönebilir
          setToken(storedToken);
          setUser(data.user || JSON.parse(storedUser));
        } else {
          // Token geçersiz veya süresi dolmuşsa lokal üssü temizle
          logout();
        }
      } catch (error) {
        console.error('Auth doğrulanırken hata oluştu şef:', error);
        // Ağ hatası vs. durumunda kullanıcıyı hemen atmamak için mevcut veriyi koruyabiliriz,
        // ya da güvenlik için tamamen logout yapabiliriz. Şimdilik lokal veriyi set edelim:
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('shopflow_token', tokenData);
    localStorage.setItem('shopflow_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shopflow_token');
    localStorage.removeItem('shopflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth mutlaka AuthProvider içinde kullanılmalıdır şef!');
  }
  return context;
};