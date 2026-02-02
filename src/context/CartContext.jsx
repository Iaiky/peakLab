import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Ajouter un produit au panier
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const isPresent = prev.find(i => i.id === product.id);
      if (isPresent) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + quantity } : i);
      }
      return [...prev, { ...product, qty: quantity }];
    });
  };

  // modifier quantité du produit
  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.qty + delta;
          // Si la nouvelle quantité est 0 ou moins, on pourrait soit bloquer à 1, 
          // soit supprimer l'article. Ici on bloque à 1.
          return { ...item, qty: Math.max(1, newQty) };
        }
        return item;
      });
    });
  };

  // Supprimer un produit
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Calculer le nombre total d'articles pour le badge de la Navbar
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Calculer le prix total
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);