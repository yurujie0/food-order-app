// 全局主题配置 - 美食应用专属设计系统
import { Colors } from './Colors';

export const Theme = {
  // 圆角系统
  borderRadius: {
    small: 8,
    medium: 12,
    large: 16,
    xl: 20,
    xxl: 24,
    full: 9999,
  },

  // 间距系统
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // 阴影系统
  shadows: {
    small: {
      shadowColor: Colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: Colors.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: Colors.shadow.dark,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    primary: {
      shadowColor: Colors.shadow.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  },

  // 字体系统
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
      color: Colors.text,
    },
    h2: {
      fontSize: 26,
      fontWeight: 'bold',
      lineHeight: 34,
      color: Colors.text,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
      color: Colors.text,
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
      lineHeight: 24,
      color: Colors.text,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: 'normal',
      lineHeight: 20,
      color: Colors.textLight,
    },
    caption: {
      fontSize: 12,
      fontWeight: 'normal',
      lineHeight: 16,
      color: Colors.textMuted,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 1,
    },
  },

  // 动画配置
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    spring: {
      tension: 300,
      friction: 10,
    },
  },

  // 卡片样式
  card: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 16,
    ...{
      shadowColor: Colors.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
  },

  // 按钮样式
  button: {
    primary: {
      backgroundColor: Colors.primary,
      borderRadius: 16,
      height: 56,
      ...{
        shadowColor: Colors.shadow.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
      },
    },
    secondary: {
      backgroundColor: Colors.card,
      borderRadius: 16,
      height: 56,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      ...{
        shadowColor: Colors.shadow.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 4,
      },
    },
  },

  // 输入框样式
  input: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 15,
    color: Colors.text,
  },

  // 分类芯片样式
  chip: {
    default: {
      backgroundColor: Colors.card,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      ...{
        shadowColor: Colors.shadow.light,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 1,
      },
    },
    selected: {
      backgroundColor: Colors.primary,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      ...{
        shadowColor: Colors.shadow.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 3,
      },
    },
  },
};

// 导出常用样式组合
export const CommonStyles = {
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: Theme.spacing.md,
  },
};
