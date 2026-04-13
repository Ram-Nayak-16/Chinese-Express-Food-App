import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(
    localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : []
  );

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x._id === product._id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x._id === existItem._id ? { ...product, qty: x.qty + qty } : x
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
  };

  const decreaseQty = (id) => {
    const existItem = cartItems.find((x) => x._id === id);
    if (existItem && existItem.qty > 1) {
      setCartItems(cartItems.map((x) => x._id === id ? { ...x, qty: x.qty - 1 } : x));
    } else if (existItem && existItem.qty === 1) {
      removeFromCart(id);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Advanced Billing Logic
  const deliveryPrice = itemsPrice > 300 || itemsPrice === 0 ? 0 : 40;
  const gstPrice = itemsPrice * 0.05;
  const handlingPrice = itemsPrice > 0 ? 10 : 0;
  const gatewayPrice = itemsPrice * 0.02;
  const discountPrice = itemsPrice > 500 ? 50 : 0;
  
  const totalPrice = itemsPrice + deliveryPrice + gstPrice + handlingPrice + gatewayPrice - discountPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        decreaseQty,
        clearCart,
        itemsPrice,
        totalItems,
        deliveryPrice,
        gstPrice,
        handlingPrice,
        gatewayPrice,
        discountPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
