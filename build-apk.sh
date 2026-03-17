#!/bin/bash
# 构建 Android APK

echo "================================"
echo "Food Order App - APK 构建脚本"
echo "================================"
echo ""

# 检查是否安装了 Android SDK
if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
    echo "⚠️  未检测到 Android SDK"
    echo ""
    echo "请确保已安装 Android Studio 并配置环境变量："
    echo "  export ANDROID_HOME=/path/to/android/sdk"
    echo "  export PATH=\$PATH:\$ANDROID_HOME/emulator"
    echo "  export PATH=\$PATH:\$ANDROID_HOME/platform-tools"
    echo ""
    echo "或者使用 EAS Build 云服务构建："
    echo "  npx eas build -p android --profile preview"
    echo ""
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
npm install

# 预构建
echo "🔧 预构建..."
npx expo prebuild --platform android

# 进入 Android 目录
cd android

# 构建 APK
echo "🏗️  构建 APK..."
./gradlew assembleRelease

# 检查构建结果
APK_PATH="app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    echo ""
    echo "✅ APK 构建成功！"
    echo ""
    echo "📱 APK 路径: $(pwd)/$APK_PATH"
    echo ""
    echo "文件大小: $(ls -lh $APK_PATH | awk '{print $5}')"
    echo ""
else
    echo ""
    echo "❌ APK 构建失败"
    echo ""
    exit 1
fi
