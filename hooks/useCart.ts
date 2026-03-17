import { useState, useEffect, useCallback } from 'react';
import { CartItem, Dish } from '../types';
import { cartApi } from '../services/api';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载购物车
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const items = await cartApi.getCart();
      setCart(items);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 添加到购物车
  const addToCart = useCallback(async (dish: Dish, quantity: number = 1) => {
    const updatedCart = await cartApi.addToCart(dish, quantity);
    setCart(updatedCart);
    return updatedCart;
  }, []);

  // 更新数量
  const updateQuantity = useCallback(async (dishId: string, quantity: number) => {
    const updatedCart = await cartApi.updateQuantity(dishId, quantity);
    setCart(updatedCart);
    return updatedCart;
  }, []);

  // 从购物车移除
  const removeFromCart = useCallback(async (dishId: string) => {
    const updatedCart = await cartApi.removeFromCart(dishId);
    setCart(updatedCart);
    return updatedCart;
  }, []);

  // 清空购物车
  const clearCart = useCallback(async () => {
    await cartApi.clearCart();
    setCart([]);
  }, []);

  // 计算总价
  const totalAmount = cart.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
  
  // 计算总数量
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    isLoading,
    totalAmount,
    totalCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: loadCart,
  };
}
