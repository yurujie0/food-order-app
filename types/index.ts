// 用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  createdAt: string;
}

// 菜品分类
export type DishCategory = 'hot' | 'cold' | 'soup' | 'staple' | 'drink' | 'dessert';

export const CategoryLabels: Record<DishCategory, string> = {
  hot: '热菜',
  cold: '凉菜',
  soup: '汤品',
  staple: '主食',
  drink: '饮品',
  dessert: '甜品',
};

// 菜品
export interface Dish {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: DishCategory;
  description: string;
  image: string;
  isAvailable: boolean;
  createdAt: string;
}

// 购物车项
export interface CartItem {
  dish: Dish;
  quantity: number;
}

// 订单状态
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export const OrderStatusLabels: Record<OrderStatus, string> = {
  pending: '待处理',
  preparing: '制作中',
  ready: '待取餐',
  completed: '已完成',
  cancelled: '已取消',
};

// 订单项
export interface OrderItem {
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
}

// 订单
export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

// 登录请求
export interface LoginRequest {
  email: string;
  password: string;
}

// 注册请求
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

// API 响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// 颜色主题
export interface Colors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

// 版本信息
export interface VersionInfo {
  version: string;
  versionCode: number;
  downloadUrl: string;
  releaseNotes: string;
  forceUpdate: boolean;
}
