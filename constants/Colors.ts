// 美食主题配色 - 温暖、现代、有层次感
export const Colors = {
  // 主色调 - 温暖的橙红色系
  primary: '#FF6B35',
  primaryLight: '#FF8C61',
  primaryDark: '#E55A2B',
  primaryGradient: ['#FF6B35', '#FF8C61'],

  // 辅助色 - 深灰和暖白
  secondary: '#2D3436',
  secondaryLight: '#636E72',

  // 背景色 - 温暖的米白色
  background: '#FAF7F2',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  // 文字色
  text: '#2D3436',
  textLight: '#636E72',
  textMuted: '#B2BEC3',

  // 边框和分割线 - 更柔和
  border: '#E8E4DE',
  divider: '#F0EDE8',

  // 状态色
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#FF6B6B',
  info: '#74B9FF',

  // 分类颜色 - 更鲜明的美食色调
  category: {
    hot: '#E74C3C',      // 热菜 - 鲜红
    cold: '#3498DB',      // 凉菜 - 清爽蓝
    soup: '#1ABC9C',      // 汤品 - 清新绿
    staple: '#F39C12',    // 主食 - 金黄
    drink: '#9B59B6',     // 饮品 - 优雅紫
    dessert: '#E91E63',   // 甜品 - 粉红
  },

  // 订单状态颜色
  orderStatus: {
    pending: '#FDCB6E',
    preparing: '#3498DB',
    ready: '#00B894',
    completed: '#636E72',
    cancelled: '#FF6B6B',
  },

  // 新增：渐变配色
  gradients: {
    primary: ['#FF6B35', '#FF8C61'],
    success: ['#00B894', '#00CEC9'],
    card: ['#FFFFFF', '#FAF9F7'],
    overlay: ['rgba(255,107,53,0.8)', 'rgba(255,140,97,0.6)'],
  },

  // 新增：阴影颜色
  shadow: {
    light: 'rgba(0,0,0,0.05)',
    medium: 'rgba(0,0,0,0.1)',
    dark: 'rgba(0,0,0,0.15)',
    primary: 'rgba(255,107,53,0.3)',
  },
};

// 暗色主题
export const DarkColors = {
  ...Colors,
  background: '#1A1A2E',
  surface: '#16213E',
  card: '#1E2A4A',
  text: '#EAEAEA',
  textLight: '#A0A0A0',
  textMuted: '#6C6C6C',
  border: '#2D3748',
  divider: '#2D3748',
};
