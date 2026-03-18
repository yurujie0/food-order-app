import { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '../types';
import { orderApi, statsApi } from '../services/api';

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载订单
  useEffect(() => {
    loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderApi.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 创建订单
  const createOrder = useCallback(async (data: {
    items: { dishId: string; quantity: number }[];
    note?: string;
  }) => {
    const newOrder = await orderApi.createOrder(data);
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  }, []);

  // 更新订单状态
  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const updatedOrder = await orderApi.updateOrderStatus(orderId, status);
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    return updatedOrder;
  }, []);

  // 取消订单
  const cancelOrder = useCallback(async (orderId: string) => {
    const updatedOrder = await orderApi.cancelOrder(orderId);
    setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    return updatedOrder;
  }, []);

  // 获取订单统计
  const getOrderStats = useCallback(async () => {
    try {
      const stats = await statsApi.getStats();
      return {
        total: stats.totalOrders,
        pending: stats.pendingOrders,
        preparing: stats.preparingOrders,
        completed: stats.completedOrders,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        todayRevenue: stats.todayRevenue,
      };
    } catch {
      // 如果获取失败，使用本地计算
      return {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        preparing: orders.filter(o => o.status === 'preparing').length,
        completed: orders.filter(o => o.status === 'completed').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        todayRevenue: orders
          .filter(o => {
            const orderDate = new Date(o.createdAt).toDateString();
            const today = new Date().toDateString();
            return orderDate === today && o.status !== 'cancelled';
          })
          .reduce((sum, o) => sum + o.totalAmount, 0),
      };
    }
  }, [orders]);

  return {
    orders,
    isLoading,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    getOrderStats,
    refreshOrders: loadOrders,
  };
}
