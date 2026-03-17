#!/bin/bash
# EAS Build APK 构建脚本

echo "🚀 Food Order App - EAS Build"
echo "=============================="
echo ""

# 检查 EAS CLI
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI 未找到"
    echo "请运行: npm install -g eas-cli"
    exit 1
fi

# 检查登录状态
echo "🔍 检查登录状态..."
eas whoami
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 未登录 Expo"
    echo "请运行: eas login"
    exit 1
fi

echo "✅ 已登录"
echo ""

# 安装依赖
echo "📦 安装依赖..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"
echo ""

# 开始构建
echo "🏗️  开始构建 APK..."
echo ""
eas build -p android --profile preview

echo ""
echo "✅ 构建已提交到 EAS 云端"
echo ""
echo "查看构建进度:"
echo "  1. 访问: https://expo.dev/builds"
echo "  2. 或运行: eas build:list"
echo ""
echo "构建完成后，运行以下命令获取下载链接:"
echo "  eas build:list --limit 1"
echo ""
