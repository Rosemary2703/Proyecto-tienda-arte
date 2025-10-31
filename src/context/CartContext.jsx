import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('art_gallery_cart');
    return localData ? JSON.parse(localData) : [];
  });
  const [isCartLoading, setIsCartLoading] = useState(false);

  // ✅ Guardar carrito en localStorage
  useEffect(() => {
    localStorage.setItem('art_gallery_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Agregar producto al carrito
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const exists = prevItems.find(item => item.product.id === product.id);
      if (exists) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  // ✅ Eliminar producto
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  // ✅ Actualizar cantidad
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // ✅ Calcular total correctamente (usa product.price)
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + (item.product.price * item.quantity),
    0
  );

  // ✅ Checkout: guardar pedido en Supabase
  const checkout = async (extra = {}) => {
    if (!user) {
      alert('⚠️ Debes iniciar sesión para comprar.');
      return;
    }

    setIsCartLoading(true);
    try {
      // 1) Crear orden
      const orderPayload = {
        user_id: user.id,
        total: cartTotal,
        status: 'pending',
        ...extra
      };

      const { data: orderData, error: orderErr } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (orderErr) throw orderErr;

      const orderId = orderData.id;

      // 2) Crear order_items
      const itemsPayload = cartItems.map(ci => ({
        order_id: orderId,
        product_id: ci.product.id,
        quantity: ci.quantity,
        unit_price: ci.product.price
      }));

      const { error: itemsErr } = await supabase
        .from('order_items')
        .insert(itemsPayload);

      if (itemsErr) throw itemsErr;

      // 3) Actualizar stock
      for (const ci of cartItems) {
        const newStock = Math.max((ci.product.stock ?? 0) - ci.quantity, 0);
        await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', ci.product.id);
      }

      // 4) Limpiar carrito
      setCartItems([]);
      setIsCartLoading(false);

      alert(`✅ Pedido realizado con éxito. Total: $${cartTotal.toFixed(2)}`);
    } catch (err) {
      console.error('Error en checkout:', err);
      setIsCartLoading(false);
      alert('❌ Ocurrió un error al procesar tu pedido.');
    }
  };

  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isCartLoading,
    checkout
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
