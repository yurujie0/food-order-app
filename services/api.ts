// API 服务 - 调用 FastAPI 后端
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, Dish, Order, CartItem, 
  LoginRequest, RegisterRequest, 
  DishCategory, OrderStatus 
} from '../types';

// API 基础 URL
// 生产环境使用公网服务器地址
const API_BASE_URL = 'http://8.135.17.245:11170';

// 将 snake_case 转换为 camelCase
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// 递归转换对象中的字段名
function convertKeysToCamelCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  }
  
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const camelKey = toCamelCase(key);
        result[camelKey] = convertKeysToCamelCase(obj[key]);
      }
    }
    return result;
  }
  
  return obj;
}

// 获取 token
async function getToken(): Promise<string | null> {
  return await AsyncStorage.getItem('access_token');
}

// 通用请求函数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };
  
  // 添加认证 token
  const token = await getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// 认证相关 API
export const authApi = {
  // 登录
  login: async (data: LoginRequest): Promise<{ user: User; token: string }> => {
    const result = await apiRequest<{
      access_token: string;
      token_type: string;
      user: User;
    }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    // 保存 token
    await AsyncStorage.setItem('access_token', result.access_token);
    await AsyncStorage.setItem('user', JSON.stringify(result.user));
    
    return { user: result.user, token: result.access_token };
  },

  // 注册
  register: async (data: RegisterRequest): Promise<{ user: User; token: string }> => {
    const result = await apiRequest<{
      access_token: string;
      token_type: string;
      user: User;
    }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
      }),
    });
    
    await AsyncStorage.setItem('access_token', result.access_token);
    await AsyncStorage.setItem('user', JSON.stringify(result.user));
    
    return { user: result.user, token: result.access_token };
  },

  // 登出
  logout: async (): Promise<void> => {
    await AsyncStorage.multiRemove(['access_token', 'user', 'cart']);
  },

  // 获取当前用户
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        return JSON.parse(userJson);
      }
      
      // 尝试从服务器获取
      const data = await apiRequest<any>('/api/auth/me');
      const user = convertKeysToCamelCase(data);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch {
      return null;
    }
  },
};

// 菜品相关 API
export const dishApi = {
  // 获取所有菜品
  getDishes: async (category?: string): Promise<Dish[]> => {
    const params = new URLSearchParams();
    if (category && category !== 'all') {
      params.append('category', category);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await apiRequest<any[]>(`/api/dishes${query}`);
    return convertKeysToCamelCase(data);
  },

  // 获取单个菜品
  getDish: async (id: string): Promise<Dish | null> => {
    try {
      const data = await apiRequest<any>(`/api/dishes/${id}`);
      return convertKeysToCamelCase(data);
    } catch {
      return null;
    }
  },

  // 创建菜品（管理员）
  createDish: async (data: Omit<Dish, 'id' | 'createdAt'>): Promise<Dish> => {
    const result = await apiRequest<any>('/api/dishes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return convertKeysToCamelCase(result);
  },

  // 更新菜品（管理员）
  updateDish: async (id: string, data: Partial<Dish>): Promise<Dish> => {
    const result = await apiRequest<any>(`/api/dishes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return convertKeysToCamelCase(result);
  },

  // 删除菜品（管理员）
  deleteDish: async (id: string): Promise<void> => {
    await apiRequest(`/api/dishes/${id}`, {
      method: 'DELETE',
    });
  },
};

// 订单相关 API
export const orderApi = {
  // 获取所有订单
  getOrders: async (status?: string): Promise<Order[]> => {
    const params = new URLSearchParams();
    if (status && status !== 'all') {
      params.append('status', status);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    const data = await apiRequest<any[]>(`/api/orders${query}`);
    return convertKeysToCamelCase(data);
  },

  // 获取用户的订单
  getUserOrders: async (userId: string, status?: string): Promise<Order[]> => {
    // 后端会根据 token 自动判断，这里直接调用 getOrders
    return await orderApi.getOrders(status);
  },

  // 创建订单
  createOrder: async (data: {
    items: { dishId: string; quantity: number }[];
    note?: string;
  }): Promise<Order> => {
    const result = await apiRequest<any>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        items: data.items.map(item => ({
          dish_id: item.dishId,
          quantity: item.quantity,
        })),
        note: data.note,
      }),
    });
    return convertKeysToCamelCase(result);
  },

  // 更新订单状态
  updateOrderStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    const result = await apiRequest<any>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
    return convertKeysToCamelCase(result);
  },

  // 取消订单
  cancelOrder: async (id: string): Promise<Order> => {
    return await orderApi.updateOrderStatus(id, 'cancelled');
  },
};

// 购物车相关 API（仍使用本地存储）
export const cartApi = {
  // 获取购物车
  getCart: async (): Promise<CartItem[]> => {
    const cartJson = await AsyncStorage.getItem('cart');
    return cartJson ? JSON.parse(cartJson) : [];
  },

  // 添加到购物车
  addToCart: async (dish: Dish, quantity: number = 1): Promise<CartItem[]> => {
    const cart = await cartApi.getCart();
    const existingIndex = cart.findIndex(item => item.dish.id === dish.id);
    
    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({ dish, quantity });
    }
    
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // 更新购物车项数量
  updateQuantity: async (dishId: string, quantity: number): Promise<CartItem[]> => {
    const cart = await cartApi.getCart();
    const index = cart.findIndex(item => item.dish.id === dishId);
    
    if (index >= 0) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = quantity;
      }
    }
    
    await AsyncStorage.setItem('cart', JSON.stringify(cart));
    return cart;
  },

  // 从购物车移除
  removeFromCart: async (dishId: string): Promise<CartItem[]> => {
    const cart = await cartApi.getCart();
    const filtered = cart.filter(item => item.dish.id !== dishId);
    await AsyncStorage.setItem('cart', JSON.stringify(filtered));
    return filtered;
  },

  // 清空购物车
  clearCart: async (): Promise<void> => {
    await AsyncStorage.removeItem('cart');
  },

  // 计算总价
  calculateTotal: (cart: CartItem[]): number => {
    return cart.reduce((total, item) => total + item.dish.price * item.quantity, 0);
  },
};

// 统计 API（管理员）
export const statsApi = {
  getStats: async (): Promise<{
    totalOrders: number;
    pendingOrders: number;
    preparingOrders: number;
    completedOrders: number;
    todayRevenue: number;
  }> => {
    const data = await apiRequest<any>('/api/stats');
    return convertKeysToCamelCase(data);
  },
};
