// 主题颜色
export const Colors = {
  // 主色调
  primary: '#FF6B35',
  primaryLight: '#FF8C61',
  primaryDark: '#E55A2B',
  
  // 辅助色
  secondary: '#2D3436',
  secondaryLight: '#636E72',
  
  // 背景色
  background: '#F5F5F5',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // 文字色
  text: '#2D3436',
  textLight: '#636E72',
  textMuted: '#B2BEC3',
  
  // 边框和分割线
  border: '#DFE6E9',
  divider: '#DFE6E9',
  
  // 状态色
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#D63031',
  info: '#0984E3',
  
  // 分类颜色
  category: {
    hot: '#E74C3C',
    cold: '#3498DB',
    soup: '#1ABC9C',
    staple: '#F39C12',
    drink: '#9B59B6',
    dessert: '#E91E63',
  },
  
  // 订单状态颜色
  orderStatus: {
    pending: '#FDCB6E',
    preparing: '#3498DB',
    ready: '#00B894',
    completed: '#636E72',
    cancelled: '#D63031',
  },
};

// 暗色主题
export const DarkColors = {
  ...Colors,
  background: '#1A1A2E',
  surface: '#16213E',
  card: '#0F3460',
  text: '#EAEAEA',
  textLight: '#A0A0A0',
  textMuted: '#6C6C6C',
  border: '#2D3748',
  divider: '#2D3748',
};
