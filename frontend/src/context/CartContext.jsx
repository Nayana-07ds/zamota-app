import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('zamota_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [lastOrder, setLastOrder] = useState(() => {
    const saved = localStorage.getItem('zamota_last_order');
    return saved ? JSON.parse(saved) : null;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('zamota_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('zamota_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (lastOrder) {
      localStorage.setItem('zamota_last_order', JSON.stringify(lastOrder));
    }
  }, [lastOrder]);

  useEffect(() => {
    localStorage.setItem('zamota_orders', JSON.stringify(orders));
  }, [orders]);

  const saveOrder = (orderData) => {
    const orderWithId = {
      ...orderData,
      id: `ORD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      userEmail: user?.email || 'guest'
    };
    setLastOrder(orderWithId);
    setOrders(prev => [orderWithId, ...prev]);
    return orderWithId;
  };

  const addToCart = (dish) => {
    const existing = items.find(i => i.id === dish.id);
    if (existing) {
      toast.success(`Increased ${dish.name} quantity`, { id: `cart-${dish.id}` });
      setItems(prev => prev.map(i => i.id === dish.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      toast.success(`${dish.name} added to cart`, { id: `cart-${dish.id}` });
      setItems(prev => [...prev, { ...dish, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Item removed from cart');
  };

  const updateQty = (id, delta) => {
    setItems(prev =>
      prev
        .map(i => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter(i => i.qty > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((sum, item) => sum + item.qty, 0);
  const subtotal  = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addToCart, 
      removeFromCart, 
      updateQty, 
      clearCart, 
      cartCount, 
      subtotal,
      lastOrder: lastOrder?.userEmail === (user?.email || 'guest') ? lastOrder : null,
      orders: orders.filter(o => o.userEmail === (user?.email || 'guest') || (o.userEmail === undefined && !user)),
      saveOrder
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
