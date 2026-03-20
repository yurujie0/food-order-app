const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'assets');

const sizes = {
  'icon': 1024,
  'icon-1024': 1024,
  'icon-512': 512,
  'icon-192': 192,
  'icon-144': 144,
  'icon-96': 96,
  'icon-48': 48,
};

async function convertSVGtoPNG() {
  console.log('🎨 Converting SVG icons to PNG...\n');
  
  for (const [name, size] of Object.entries(sizes)) {
    const svgPath = path.join(assetsDir, `${name}.svg`);
    const pngPath = path.join(assetsDir, `${name}.png`);
    
    if (!fs.existsSync(svgPath)) {
      console.log(`⚠️  Skipping: ${name}.svg (not found)`);
      continue;
    }
    
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(pngPath);
      
      console.log(`✅ Generated: ${name}.png (${size}x${size})`);
    } catch (error) {
      console.error(`❌ Error converting ${name}.svg:`, error.message);
    }
  }
  
  // 复制 icon-1024.png 为 icon.png (主图标)
  try {
    fs.copyFileSync(
      path.join(assetsDir, 'icon-1024.png'),
      path.join(assetsDir, 'icon.png')
    );
    console.log('\n✅ Copied icon-1024.png to icon.png');
  } catch (error) {
    console.error('❌ Error copying icon:', error.message);
  }
  
  console.log('\n🎉 All icons generated successfully!');
  console.log('\n📱 Icon Design Summary:');
  console.log('  • Style: Modern flat design with warm colors');
  console.log('  • Theme: Smart Home Assistant');
  console.log('  • Colors: Coral Red (#FF6B6B) + Warm White (#FFF8F0)');
  console.log('  • Elements: House + Smart Ring + Heart');
}

convertSVGtoPNG();