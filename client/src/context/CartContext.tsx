import { createContext, useContext, useState, type ReactNode } from "react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  stock_quantity: number;
}

interface CartItem{

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


  const [cart, setCart] = useState<CartItem[]>([]);


 function addToCart(newItem: Product, newQuantity: number) {

  setCart(prevCart => {

    const existingItem = prevCart.find(
      i => i.item.id === newItem.id
    );

    if (existingItem) {

      return prevCart.map(i =>
        i.item.id === newItem.id
          ? {
              ...i,
              quantity: i.quantity + newQuantity
            }
          : i
      );

    } else {

      return [
        ...prevCart,
        {
          item: newItem,
          quantity: newQuantity
        }
      ];

    }

  });

}

function removeFromCart(productId: number){

  setCart(cart.filter(i => i.item.id !== productId)) 
}

function increaseQuantity(productId: number){

  const updatedCart = cart.map(item => 
  item.item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
);

setCart(updatedCart);

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
  <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
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
