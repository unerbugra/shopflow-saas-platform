
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode
} from "react";
import { useAuth } from "./AuthContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
}

interface CartItem {
  item: Product;
  quantity: number;
}

interface ApiCartItem extends Product {
  product_id: number;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (newItem: Product, newQuantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  increaseQuantity: (productId: number) => Promise<void>;
  decreaseQuantity: (productId: number) => Promise<void>;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL;

export default function CartProvider({ children }: CartProviderProps) {
  const { user, token, loading } = useAuth();

  const [cart, setCart] = useState<CartItem[]>([]);
  const cartRef = useRef<CartItem[]>([]);
  const pendingRef = useRef(false);

  // API'den gelen sepeti mevcut frontend formatına dönüştür
  function formatCart(data: ApiCartItem[]): CartItem[] {
    return data.map(({ product_id, quantity, ...product }) => ({
      item: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock_quantity: product.stock_quantity
      },
      quantity
    }));
  }

  // Sepeti PostgreSQL'den yükle
  useEffect(() => {
    let cancelled = false;

    // Kullanıcı değiştiğinde eski sepeti hemen temizle
    cartRef.current = [];
    setCart([]);

    if (loading || !user || !token) {
      return;
    }

    async function loadCart() {
      try {
        const response = await fetch(`${API_URL}/api/cart`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          cache: "no-store"
        });

        if (!response.ok) {
          throw new Error("Sepet yüklenemedi.");
        }

        const data: ApiCartItem[] = await response.json();

        if (!cancelled) {
          const formattedCart = formatCart(data);
          cartRef.current = formattedCart;
          setCart(formattedCart);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Sepet yükleme hatası:", error);
        }
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [user?.id, token, loading]);

  // Sepeti backend'den tekrar getir
  async function refreshCart(currentToken: string) {
    const response = await fetch(`${API_URL}/api/cart`, {
      headers: {
        Authorization: `Bearer ${currentToken}`
      },
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Sepet güncellenemedi.");
    }

    const data: ApiCartItem[] = await response.json();
    const formattedCart = formatCart(data);

    // İstek sırasında kullanıcı değişmiş olabilir
    if (localStorage.getItem("shopflow_token") === currentToken) {
      cartRef.current = formattedCart;
      setCart(formattedCart);
    }
  }

  // Ortak API isteği fonksiyonu
  async function cartRequest(
    path: string,
    method: "POST" | "PATCH" | "DELETE",
    body?: object
  ) {
    if (!token || !user) {
      console.error("Sepet işlemi için giriş yapmalısınız.");
      return;
    }

    // Aynı anda birden fazla sepet değişikliğini engelle
    if (pendingRef.current) {
      return;
    }

    pendingRef.current = true;

    try {
      const response = await fetch(`${API_URL}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(body ? { "Content-Type": "application/json" } : {})
        },
        ...(body ? { body: JSON.stringify(body) } : {})
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sepet işlemi başarısız.");
      }

      await refreshCart(token);
    } catch (error) {
      console.error("Sepet işlemi hatası:", error);
    } finally {
      pendingRef.current = false;
    }
  }

  // Ürün ekle: mevcut miktarın üzerine ekler
  async function addToCart(newItem: Product, newQuantity: number) {
    if (!Number.isSafeInteger(newQuantity) || newQuantity <= 0) {
      return;
    }

    await cartRequest("/api/cart/items", "POST", {
      product_id: newItem.id,
      quantity: newQuantity
    });
  }

  // Ürünü sepetten tamamen kaldır
  async function removeFromCart(productId: number) {
    await cartRequest(`/api/cart/items/${productId}`, "DELETE");
  }

  // Sepetteki miktarı 1 artır
  async function increaseQuantity(productId: number) {
    const existingItem = cartRef.current.find(
      i => i.item.id === productId
    );

    if (!existingItem) return;

    if (existingItem.quantity >= existingItem.item.stock_quantity) {
      return;
    }

    await cartRequest(`/api/cart/items/${productId}`, "PATCH", {
      quantity: existingItem.quantity + 1
    });
  }

  // Sepetteki miktarı 1 azalt
  async function decreaseQuantity(productId: number) {
    const existingItem = cartRef.current.find(
      i => i.item.id === productId
    );

    if (!existingItem) return;

    if (existingItem.quantity <= 1) {
      return;
    }

    await cartRequest(`/api/cart/items/${productId}`, "PATCH", {
      quantity: existingItem.quantity - 1
    });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
