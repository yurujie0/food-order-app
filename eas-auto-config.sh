#!/bin/bash
# 自动配置 EAS 项目并构建 APK

echo "🚀 EAS 自动配置与构建"
echo "====================="
echo ""

# 检查 EAS CLI
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI 未安装"
    exit 1
fi

# 检查登录
eas whoami &>/dev/null
if [ $? -ne 0 ]; then
    echo "❌ 请先登录: eas login"
    exit 1
fi

echo "✅ 已登录 EAS"
echo ""

# 创建 EAS project ID 配置文件
if [ !f "eas.json" ]; then
    echo "❌ eas.json 不存在"
    exit 1
fi

# 检查是否已有 projectId
if grep -q "projectId" eas.json 2>/dev/null; then
    echo "✅ EAS 项目已配置"
else
    echo "🔧 配置 EAS 项目..."
    
    # 使用 expect 自动回答交互式提示
    if command -v expect &> /dev/null; then
        expect -c "
            spawn eas build:configure -p android
            expect \"Would you like automatically\"
            send \"y\r\"
            expect eof
        "
    else
        # 尝试直接创建项目
        echo "尝试创建 EAS 项目..."
        
        # 获取当前用户和项目名
        USER_NAME=$(eas whoami 2>/dev/null | grep -oE '[a-zA-Z0-9_-]+' | head -1)
        PROJECT_SLUG="food-order-app"
        
        if [ -z "$USER_NAME" ]; then
            echo "无法获取用户名，请手动运行: eas build:configure"
            exit 1
        fi
        
        echo "用户: $USER_NAME"
        echo "项目: $PROJECT_SLUG"
        
        # 使用 yes 命令自动回答 y
        yes | eas build:configure -p android 2>&1 || true
    fi
fi

echo ""
echo "🏗️ 开始构建 APK..."
echo ""

# 开始构建
eas build -p android --profile preview --non-interactive

echo ""
echo "✅ 构建已提交到云端"
echo ""
echo "查看进度:"
echo "  - 命令: eas build:list"
echo "  - 网页: https://expo.dev/builds"
