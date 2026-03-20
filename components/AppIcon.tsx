import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

// 家庭助手图标组件
export function HomeAssistantIcon({ size = 1024 }) {
  const colors = {
    primary: '#FF6B6B',      // 温暖珊瑚红
    secondary: '#FFA07A',    // 浅珊瑚色
    accent: '#FFE4B5',       // 米黄色
    background: '#FFF8F0',   // 暖白背景
    shadow: '#E8D5C4',       // 阴影色
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 1024 1024">
        {/* 背景圆 */}
        <Circle
          cx={512}
          cy={512}
          r={480}
          fill={colors.background}
        />
        
        {/* 外圈装饰 */}
        <Circle
          cx={512}
          cy={512}
          r={460}
          fill="none"
          stroke={colors.primary}
          strokeWidth={8}
          opacity={0.3}
        />

        {/* 房子主体 */}
        <G transform="translate(512, 480)">
          {/* 房子底部 */}
          <Rect
            x={-200}
            y={-50}
            width={400}
            height={300}
            rx={30}
            fill={colors.primary}
          />
          
          {/* 房子顶部三角形屋顶 */}
          <Path
            d="M -220 -50 L 0 -250 L 220 -50 Z"
            fill={colors.secondary}
          />
          
          {/* 烟囱 */}
          <Rect
            x={120}
            y={-180}
            width={60}
            height={100}
            rx={10}
            fill={colors.secondary}
          />
          
          {/* 门 */}
          <Rect
            x={-60}
            y={80}
            width={120}
            height={170}
            rx={15}
            fill={colors.accent}
          />
          
          {/* 门把手 */}
          <Circle
            cx={35}
            cy={165}
            r={12}
            fill={colors.primary}
          />
          
          {/* 窗户 - 左 */}
          <Rect
            x={-160}
            y={-20}
            width={80}
            height={80}
            rx={10}
            fill={colors.accent}
          />
          {/* 窗户十字 - 左 */}
          <Path
            d="M -120 -20 L -120 60 M -160 20 L -80 20"
            stroke={colors.primary}
            strokeWidth={6}
          />
          
          {/* 窗户 - 右 */}
          <Rect
            x={80}
            y={-20}
            width={80}
            height={80}
            rx={10}
            fill={colors.accent}
          />
          {/* 窗户十字 - 右 */}
          <Path
            d="M 120 -20 L 120 60 M 80 20 L 160 20"
            stroke={colors.primary}
            strokeWidth={6}
          />
        </G>

        {/* 智能光环 - 表示AI助手 */}
        <Circle
          cx={512}
          cy={780}
          r={40}
          fill={colors.secondary}
          opacity={0.9}
        />
        {/* 光环效果 */}
        <Circle
          cx={512}
          cy={780}
          r={55}
          fill="none"
          stroke={colors.secondary}
          strokeWidth={4}
          opacity={0.5}
        />
        <Circle
          cx={512}
          cy={780}
          r={70}
          fill="none"
          stroke={colors.secondary}
          strokeWidth={2}
          opacity={0.3}
        />

        {/* 爱心装饰 - 表示温暖家庭 */}
        <Path
          d="M 280 350 C 280 320, 310 300, 340 320 C 370 300, 400 320, 400 350 C 400 380, 340 420, 340 420 C 340 420, 280 380, 280 350 Z"
          fill={colors.secondary}
          opacity={0.8}
          transform="scale(0.6) translate(300, 200)"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// 导出图标配置
export const appIconConfig = {
  // 主色调
  primaryColor: '#FF6B6B',
  secondaryColor: '#FFA07A',
  backgroundColor: '#FFF8F0',
  
  // 图标尺寸
  sizes: {
    appIcon: 1024,      // App Store
    appIconSmall: 512,  // 桌面图标
    notification: 96,   // 通知图标
    favicon: 32,        // 网页图标
  },
  
  // 设计说明
  description: {
    name: 'Food Order App',
    tagline: '您的智能家庭助手',
    concept: '温暖的家 + 智能科技',
    colors: {
      primary: '珊瑚红 - 温暖、热情',
      secondary: '浅珊瑚 - 柔和、友好', 
      accent: '米黄色 - 家的温馨',
      background: '暖白色 - 纯净、明亮',
    },
    elements: {
      house: '家的象征，代表家庭',
      heart: '爱心装饰，代表温暖关爱',
      waves: '智能光环，代表AI助手',
    },
  },
};