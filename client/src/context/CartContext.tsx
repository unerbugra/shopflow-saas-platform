
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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

interface CartContextType {
  cart: CartItem[];
  addToCart: (newItem: Product, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
}

interface CartProviderProps {
  children: ReactNode;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export default function CartProvider({ children }: CartProviderProps) {

  const [cart, setCart] = useState<CartItem[]>(() => {
  const savedCart = localStorage.getItem("shopflow_cart");

  if (savedCart) {
    return JSON.parse(savedCart);
  }

  return [];
});;

useEffect(() => {
  localStorage.setItem("shopflow_cart", JSON.stringify(cart));
}, [cart]);

  function addToCart(newItem: Product, newQuantity: number) {

    setCart(prevCart => {

      const existingItem = prevCart.find(
        i => i.item.id === newItem.id
      );

      const stock = newItem.stock_quantity;

      if (stock <= 0 || newQuantity <= 0) {
        return prevCart;
      }

      if (existingItem) {

        return prevCart.map(i =>
          i.item.id === newItem.id
            ? {
                ...i,
                quantity: Math.min(i.quantity + newQuantity, stock)
              }
            : i
        );

      } else {

        return [
          ...prevCart,
          {
            item: newItem,
            quantity: Math.min(newQuantity, stock)
          }
        ];

      }

    });

  }

  function removeFromCart(productId: number) {

    setCart(cart.filter(i => i.item.id !== productId));

  }

  function increaseQuantity(productId: number) {

    setCart(prevCart =>
      prevCart.map(item =>
        item.item.id === productId &&
        item.quantity < item.item.stock_quantity
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

  }

  function decreaseQuantity(productId: number) {

    const updatedCart = cart.map(item =>
      item.item.id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );

    setCart(updatedCart);

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
