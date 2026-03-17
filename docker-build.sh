#!/bin/bash
# Docker 构建 APK 脚本

echo "🚀 Food Order App - Docker 构建"
echo "================================"
echo ""

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装"
    exit 1
fi

echo "✅ Docker 已安装: $(docker --version)"
echo ""

# 进入项目目录
cd "$(dirname "$0")"

# 构建 Docker 镜像
echo "🔧 构建 Docker 镜像..."
docker build -t food-order-app-builder . 2>&1

if [ $? -ne 0 ]; then
    echo "❌ Docker 构建失败"
    exit 1
fi

# 运行容器并提取 APK
echo ""
echo "🏗️ 构建 APK..."
docker run --rm -v "$(pwd)/output:/app/output" food-order-app-builder

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ APK 构建成功！"
    echo ""
    if [ -f "output/app-release.apk" ]; then
        echo "📱 APK 路径: $(pwd)/output/app-release.apk"
        echo "📦 文件大小: $(ls -lh output/app-release.apk | awk '{print $5}')"
    fi
else
    echo "❌ APK 构建失败"
    exit 1
fi
