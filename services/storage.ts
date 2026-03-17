import AsyncStorage from '@react-native-async-storage/async-storage';

const StorageKeys = {
  USER: '@food_order_user',
  TOKEN: '@food_order_token',
  CART: '@food_order_cart',
  DISHES: '@food_order_dishes',
  ORDERS: '@food_order_orders',
};

export const storage = {
  // 用户数据
  async getUser<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(StorageKeys.USER);
    return data ? JSON.parse(data) : null;
  },

  async setUser<T>(user: T): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.USER, JSON.stringify(user));
  },

  async removeUser(): Promise<void> {
    await AsyncStorage.removeItem(StorageKeys.USER);
  },

  // Token
  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem(StorageKeys.TOKEN);
  },

  async setToken(token: string): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.TOKEN, token);
  },

  async removeToken(): Promise<void> {
    await AsyncStorage.removeItem(StorageKeys.TOKEN);
  },

  // 购物车
  async getCart<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(StorageKeys.CART);
    return data ? JSON.parse(data) : null;
  },

  async setCart<T>(cart: T): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.CART, JSON.stringify(cart));
  },

  async removeCart(): Promise<void> {
    await AsyncStorage.removeItem(StorageKeys.CART);
  },

  // 菜品
  async getDishes<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(StorageKeys.DISHES);
    return data ? JSON.parse(data) : null;
  },

  async setDishes<T>(dishes: T): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.DISHES, JSON.stringify(dishes));
  },

  // 订单
  async getOrders<T>(): Promise<T | null> {
    const data = await AsyncStorage.getItem(StorageKeys.ORDERS);
    return data ? JSON.parse(data) : null;
  },

  async setOrders<T>(orders: T): Promise<void> {
    await AsyncStorage.setItem(StorageKeys.ORDERS, JSON.stringify(orders));
  },

  // 清除所有数据
  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(StorageKeys));
  },
};
