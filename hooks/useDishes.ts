import { useState, useEffect, useCallback } from 'react';
import { Dish, DishCategory } from '../types';
import { dishApi } from '../services/api';

export function useDishes() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 加载菜品
  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setIsLoading(true);
      const data = await dishApi.getDishes();
      setDishes(data);
    } catch (error) {
      console.error('Failed to load dishes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 筛选菜品（本地筛选）
  const filteredDishes = dishes.filter(dish => {
    // 分类筛选
    if (selectedCategory !== 'all' && dish.category !== selectedCategory) {
      return false;
    }
    // 搜索筛选
    if (searchQuery && !dish.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  // 获取单个菜品
  const getDish = useCallback(async (id: string) => {
    return await dishApi.getDish(id);
  }, []);

  // 创建菜品
  const createDish = useCallback(async (data: Omit<Dish, 'id' | 'createdAt'>) => {
    const newDish = await dishApi.createDish(data);
    setDishes(prev => [...prev, newDish]);
    return newDish;
  }, []);

  // 更新菜品
  const updateDish = useCallback(async (id: string, data: Partial<Dish>) => {
    const updatedDish = await dishApi.updateDish(id, data);
    setDishes(prev => prev.map(d => d.id === id ? updatedDish : d));
    return updatedDish;
  }, []);

  // 删除菜品
  const deleteDish = useCallback(async (id: string) => {
    await dishApi.deleteDish(id);
    setDishes(prev => prev.filter(d => d.id !== id));
  }, []);

  // 切换上架状态
  const toggleAvailability = useCallback(async (id: string) => {
    const dish = dishes.find(d => d.id === id);
    if (dish) {
      await updateDish(id, { isAvailable: !dish.isAvailable });
    }
  }, [dishes, updateDish]);

  return {
    dishes,
    filteredDishes,
    isLoading,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    getDish,
    createDish,
    updateDish,
    deleteDish,
    toggleAvailability,
    refreshDishes: loadDishes,
  };
}
