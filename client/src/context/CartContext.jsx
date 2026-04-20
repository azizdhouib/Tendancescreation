import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

function sameCustomBouquet(a, b) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return a.bouquet === b.bouquet && a.chocolat === b.chocolat && a.parfum === b.parfum;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1, selectedColor = null, customBouquet = null) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(
        item =>
          item.productId === product._id &&
          item.selectedColor?.hex === selectedColor?.hex &&
          sameCustomBouquet(item.customBouquet, customBouquet)
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        quantity,
        selectedColor,
        customBouquet,
        stock: product.stock
      }];
    });
  };

  const removeItem = (productId, selectedColorHex, customBouquet = null) => {
    setItems(prev => prev.filter(
      item => !(
        item.productId === productId &&
        item.selectedColor?.hex === selectedColorHex &&
        sameCustomBouquet(item.customBouquet, customBouquet)
      )
    ));
  };

  const updateQuantity = (productId, selectedColorHex, quantity, customBouquet = null) => {
    if (quantity < 1) return;
    
    setItems(prev => prev.map(item => {
      if (
        item.productId === productId &&
        item.selectedColor?.hex === selectedColorHex &&
        sameCustomBouquet(item.customBouquet, customBouquet)
      ) {
        return { ...item, quantity: Math.min(quantity, item.stock || 99) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      total,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
