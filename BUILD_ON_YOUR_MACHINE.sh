#!/bin/bash
# 在你的电脑上执行此脚本构建 APK

echo "🚀 Food Order App - 本地构建脚本"
echo "=================================="
echo ""
echo "请在您的电脑上执行以下步骤："
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}步骤 1: 准备环境${NC}"
echo "------------------------"
echo "确保已安装："
echo "  • Node.js 18+ (https://nodejs.org)"
echo "  • Git"
echo "  • Android Studio (包含 Android SDK)"
echo ""

echo -e "${GREEN}步骤 2: 获取项目代码${NC}"
echo "------------------------"
echo "方式一：从服务器复制"
echo "  scp -r user@your-server:/home/admin/.openclaw/workspace/food-order-app ./"
echo ""
echo "方式二：如果已下载压缩包"
echo "  unzip food-order-app-complete.zip"
echo "  cd food-order-app"
echo ""

echo -e "${GREEN}步骤 3: 清理并重新安装依赖${NC}"
echo "------------------------"
cat << 'CMD'
cd food-order-app
rm -rf node_modules package-lock.json
npm install
CMD
echo ""

echo -e "${GREEN}步骤 4: 安装 EAS CLI 并登录${NC}"
echo "------------------------"
cat << 'CMD'
npm install -g eas-cli
eas login
CMD
echo ""

echo -e "${GREEN}步骤 5: 配置 EAS 项目${NC}"
echo "------------------------"
cat << 'CMD'
eas build:configure -p android
# 按提示选择 y 确认
CMD
echo ""

echo -e "${GREEN}步骤 6: 开始构建${NC}"
echo "------------------------"
cat << 'CMD'
eas build -p android --profile preview
CMD
echo ""

echo -e "${YELLOW}等待构建完成...${NC}"
echo "  • 构建时间：10-20 分钟"
echo "  • 查看进度：eas build:list"
echo "  • 或访问：https://expo.dev/builds"
echo ""

echo -e "${GREEN}步骤 7: 下载 APK${NC}"
echo "------------------------"
cat << 'CMD'
# 构建完成后，获取下载链接
eas build:list --limit 1

# 下载 APK 到本地
# 将链接复制到浏览器下载
CMD
echo ""

echo -e "${GREEN}备选方案：本地 Gradle 构建${NC}"
echo "------------------------"
echo "如果 EAS 构建失败，使用本地构建："
cat << 'CMD'
# 生成 Android 项目
npx expo prebuild --platform android

# 进入 Android 目录
cd android

# 构建 Release APK
./gradlew assembleRelease

# APK 位置：
# android/app/build/outputs/apk/release/app-release.apk
CMD
echo ""

echo "✅ 完成！"
echo ""
