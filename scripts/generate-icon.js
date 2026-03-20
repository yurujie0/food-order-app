const fs = require('fs');
const path = require('path');

// 创建 SVG 图标
function createAppIconSVG(size = 1024) {
  const colors = {
    primary: '#FF6B6B',
    secondary: '#FFA07A',
    accent: '#FFE4B5',
    background: '#FFF8F0',
  };

  const center = size / 2;
  const scale = size / 1024;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${colors.background};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FFF5E6;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="20" flood-color="#000000" flood-opacity="0.1"/>
    </filter>
  </defs>
  
  <!-- 背景圆 -->
  <circle cx="512" cy="512" r="480" fill="url(#bgGradient)" />
  
  <!-- 外圈装饰 -->
  <circle cx="512" cy="512" r="460" fill="none" stroke="${colors.primary}" stroke-width="8" opacity="0.2" />
  
  <!-- 房子主体 -->
  <g transform="translate(512, 480)">
    <!-- 房子底部 -->
    <rect x="-200" y="-50" width="400" height="300" rx="30" fill="${colors.primary}" filter="url(#shadow)" />
    
    <!-- 屋顶 -->
    <path d="M -220 -50 L 0 -250 L 220 -50 Z" fill="${colors.secondary}" />
    
    <!-- 烟囱 -->
    <rect x="120" y="-180" width="60" height="100" rx="10" fill="${colors.secondary}" />
    
    <!-- 门 -->
    <rect x="-60" y="80" width="120" height="170" rx="15" fill="${colors.accent}" />
    <circle cx="35" cy="165" r="12" fill="${colors.primary}" />
    
    <!-- 左窗 -->
    <rect x="-160" y="-20" width="80" height="80" rx="10" fill="${colors.accent}" />
    <path d="M -120 -20 L -120 60 M -160 20 L -80 20" stroke="${colors.primary}" stroke-width="6" />
    
    <!-- 右窗 -->
    <rect x="80" y="-20" width="80" height="80" rx="10" fill="${colors.accent}" />
    <path d="M 120 -20 L 120 60 M 80 20 L 160 20" stroke="${colors.primary}" stroke-width="6" />
  </g>
  
  <!-- 智能光环 -->
  <circle cx="512" cy="780" r="40" fill="${colors.secondary}" opacity="0.9" />
  <circle cx="512" cy="780" r="55" fill="none" stroke="${colors.secondary}" stroke-width="4" opacity="0.5" />
  <circle cx="512" cy="780" r="70" fill="none" stroke="${colors.secondary}" stroke-width="2" opacity="0.3" />
  
  <!-- 爱心装饰 -->
  <path d="M 280 350 C 280 320, 310 300, 340 320 C 370 300, 400 320, 400 350 C 400 380, 340 420, 340 420 C 340 420, 280 380, 280 350 Z" 
        fill="${colors.secondary}" opacity="0.8" transform="scale(0.6) translate(300, 200)" />
</svg>`;

  return svg;
}

// 生成不同尺寸的图标
const sizes = {
  'icon-1024.png': 1024,  // App Store
  'icon-512.png': 512,    // 桌面
  'icon-192.png': 192,    // Android
  'icon-144.png': 144,    // Android
  'icon-96.png': 96,      // 小图标
  'icon-48.png': 48,      // 通知
};

const assetsDir = path.join(__dirname, '..', 'assets');

// 确保 assets 目录存在
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// 生成 SVG
const svg1024 = createAppIconSVG(1024);
fs.writeFileSync(path.join(assetsDir, 'icon.svg'), svg1024);
console.log('✅ Generated: assets/icon.svg');

// 生成不同尺寸的 SVG（后续可以用工具转换为 PNG）
Object.entries(sizes).forEach(([filename, size]) => {
  const svg = createAppIconSVG(size);
  fs.writeFileSync(path.join(assetsDir, filename.replace('.png', '.svg')), svg);
  console.log(`✅ Generated: assets/${filename.replace('.png', '.svg')} (${size}x${size})`);
});

console.log('\n📱 App Icon Design:');
console.log('  Name: Food Order App');
console.log('  Tagline: 您的智能家庭助手');
console.log('  Concept: 温暖的家 + 智能科技');
console.log('  Primary Color: 珊瑚红 (#FF6B6B)');
console.log('  Secondary Color: 浅珊瑚 (#FFA07A)');
console.log('  Background: 暖白色 (#FFF8F0)');
console.log('\n💡 Use tools like ImageMagick or online converters to convert SVG to PNG');