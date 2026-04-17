import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Ajouter un produit au panier
  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const isPresent = prev.find(i => i.id === product.id);
      if (isPresent) {
        const newQty = isPresent.qty + quantity;
        // Bloque si on dépasse le stockDisponible
        if (newQty > product.stockDisponible) return prev;
        return prev.map(i => i.id === product.id ? { ...i, qty: newQty } : i);
      }
      // Bloque si stock épuisé
      if (quantity > product.stockDisponible) return prev;
      return [...prev, { ...product, qty: quantity }];
    });
  };

  // modifier quantité du produit
  const updateQuantity = (productId, delta) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const newQty = item.qty + delta;
          // Bloque en dessous de 1 et au-dessus du stockDisponible
          return { ...item, qty: Math.min(Math.max(1, newQty), item.stockDisponible) };
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

  // AJOUT DE LA FONCTION CLEAR CART
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);