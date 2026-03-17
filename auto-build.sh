#!/bin/bash
# 自动化构建脚本 - 解决交互式配置问题

set -e

echo "🚀 Food Order App - 自动化构建"
echo "================================"
echo ""

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查 Node.js
if ! command_exists node; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js 18+"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 版本: $(node -v)${NC}"

# 检查 npm
if ! command_exists npm; then
    echo -e "${RED}❌ npm 未安装${NC}"
    exit 1
fi

echo -e "${GREEN}✅ npm 版本: $(npm -v)${NC}"

# 检查 EAS CLI
if ! command_exists eas; then
    echo -e "${YELLOW}⚠️  EAS CLI 未安装，正在安装...${NC}"
    npm install -g eas-cli
fi

echo -e "${GREEN}✅ EAS CLI 已安装${NC}"

# 检查登录状态
echo ""
echo "🔍 检查 EAS 登录状态..."
if ! eas whoami &>/dev/null; then
    echo -e "${RED}❌ 未登录 EAS${NC}"
    echo "请先运行: eas login"
    exit 1
fi

echo -e "${GREEN}✅ 已登录 EAS: $(eas whoami)${NC}"

# 进入项目目录
cd "$(dirname "$0")"
echo ""
echo "📁 项目目录: $(pwd)"

# 安装依赖
echo ""
echo "📦 安装依赖..."
if [ ! -d "node_modules" ]; then
    npm install --legacy-peer-deps
else
    echo -e "${GREEN}✅ 依赖已安装${NC}"
fi

# 配置 EAS 项目
echo ""
echo "🔧 配置 EAS 项目..."

# 检查是否已配置
if [ !f "eas.json" ]; then
    echo "创建 eas.json..."
    cat > eas.json << 'EOF'
{
  "cli": {
    "version": ">= 5.0.0",
    "appVersionSource": "remote"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
EOF
fi

# 使用 expect 自动回答交互式提示
if command_exists expect; then
    echo "使用 expect 自动配置 EAS..."
    expect -c "
        spawn eas build:configure -p android
        expect \"Configure this project?\"
        send \"y\r\"
        expect eof
    " 2>/dev/null || true
else
    echo -e "${YELLOW}⚠️  expect 未安装，尝试直接构建...${NC}"
fi

# 开始构建
echo ""
echo "🏗️ 开始 EAS 构建..."
echo "这可能需要 10-20 分钟，请耐心等待..."
echo ""

# 提交构建（非交互模式）
eas build -p android --profile preview --non-interactive

echo ""
echo -e "${GREEN}✅ 构建已提交到 EAS 云端！${NC}"
echo ""
echo "查看构建进度:"
echo "  命令: eas build:list"
echo "  网页: https://expo.dev/builds"
echo ""
echo "构建完成后，运行以下命令获取下载链接:"
echo "  eas build:list --limit 1"
echo ""
