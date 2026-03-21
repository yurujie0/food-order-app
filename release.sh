#!/bin/bash

# Food Order App 发布脚本
# 用法: ./release.sh <新版本号> <version_code> <更新说明>

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
PROJECT_DIR="$HOME/.openclaw/workspace/food-order-app"
CLOUD1_HOST="admin@8.135.17.245"
FILE_SERVER="http://8.135.17.245:18000"
JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"

# 检查参数
if [ $# -lt 3 ]; then
    echo -e "${RED}用法: $0 <版本号> <version_code> <更新说明>${NC}"
    echo -e "示例: $0 1.8 8 '修复图标显示问题'"
    exit 1
fi

VERSION=$1
VERSION_CODE=$2
RELEASE_NOTES=$3

echo -e "${GREEN}=== Food Order App 发布脚本 ===${NC}"
echo -e "版本: v${VERSION} (${VERSION_CODE})"
echo -e "更新: ${RELEASE_NOTES}"
echo ""

# 1. 更新本地后端版本信息
echo -e "${YELLOW}[1/6] 更新本地后端版本信息...${NC}"
cd "$PROJECT_DIR/backend"

# 使用 sed 直接替换
sed -i "s/\"version\":\s*\"[^\"]*\"/\"version\": \"${VERSION}\"/" main.py
sed -i "s/\"version_code\":\s*[0-9]\+/\"version_code\": ${VERSION_CODE}/" main.py
sed -i "s/\"download_url\":\s*\"[^\"]*\"/\"download_url\": \"http:\/\/8.135.17.245:18000\/download\/PLACEHOLDER\"/" main.py
sed -i "s/\"release_notes\":\s*\"[^\"]*\"/\"release_notes\": \"${RELEASE_NOTES}\"/" main.py

echo "后端版本已更新"

# 1.5 更新前端版本号
echo -e "${YELLOW}[1.5/6] 更新前端版本号...${NC}"
cd "$PROJECT_DIR"

# 使用 sed 直接替换
sed -i "s/const CURRENT_VERSION = '[^']*';/const CURRENT_VERSION = '${VERSION}';/" hooks/useVersionCheck.ts
sed -i "s/const CURRENT_VERSION_CODE = [0-9]\+;/const CURRENT_VERSION_CODE = ${VERSION_CODE};/" hooks/useVersionCheck.ts

echo "前端版本已更新"

echo "VERSION=${VERSION}" > /tmp/version_info
echo "VERSION_CODE=${VERSION_CODE}" >> /tmp/version_info
echo "RELEASE_NOTES=${RELEASE_NOTES}" >> /tmp/version_info

# 2. 构建 APK
echo -e "${YELLOW}[2/6] 清理并生成 Android 项目...${NC}"
cd "$PROJECT_DIR"
rm -rf android
npx expo prebuild --platform android

# 添加 fonts.gradle 配置
if ! grep -q "react-native-vector-icons/fonts.gradle" android/app/build.gradle; then
    sed -i 's/apply plugin: "com.facebook.react"/apply plugin: "com.facebook.react"\n\n\/\/ React Native Vector Icons 字体配置\napply from: file("..\/..\/node_modules\/react-native-vector-icons\/fonts.gradle")/' android/app/build.gradle
fi

echo "sdk.dir=$HOME/android-sdk" > android/local.properties

# 2.5 复制自定义图标到 Android 项目
echo -e "${YELLOW}[2.5/6] 复制自定义图标到 Android 项目...${NC}"
cd "$PROJECT_DIR"

# Android mipmap 尺寸映射
# mdpi: 48px, hdpi: 72px, xhdpi: 96px, xxhdpi: 144px, xxxhdpi: 192px
declare -A ICON_SIZES=(
    ["mipmap-mdpi"]=48
    ["mipmap-hdpi"]=72
    ["mipmap-xhdpi"]=96
    ["mipmap-xxhdpi"]=144
    ["mipmap-xxxhdpi"]=192
)

# 检查并生成缺失的图标尺寸
for size in 48 72 96 144 192; do
    if [ ! -f "assets/icon-${size}.png" ]; then
        echo "生成 icon-${size}.png..."
        node -e "
const sharp = require('sharp');
sharp('assets/icon.svg').resize(${size}, ${size}).png().toFile('assets/icon-${size}.png').then(() => console.log('✓ icon-${size}.png 已生成'));
"
    fi
done

# 复制图标到 Android 项目的各个 mipmap 目录
for folder in "${!ICON_SIZES[@]}"; do
    size=${ICON_SIZES[$folder]}
    source_file="assets/icon-${size}.png"
    target_dir="android/app/src/main/res/${folder}"
    
    if [ -f "$source_file" ]; then
        # 删除旧的 webp 文件
        for old_file in "$target_dir"/ic_launcher*.webp; do
            [ -f "$old_file" ] && rm "$old_file" && echo "删除: $old_file"
        done
        
        # 复制新的 png 图标
        cp "$source_file" "$target_dir/ic_launcher.png"
        cp "$source_file" "$target_dir/ic_launcher_round.png"
        cp "$source_file" "$target_dir/ic_launcher_foreground.png"
        echo "✓ 已复制 ${size}px 图标到 ${folder}/"
    else
        echo -e "${RED}警告: 源文件不存在: $source_file${NC}"
    fi
done

echo "图标复制完成"

echo -e "${YELLOW}[3/6] 构建 Release APK...${NC}"
cd android
export JAVA_HOME
export PATH="$JAVA_HOME/bin:$PATH"
~/.gradle/wrapper/dists/gradle-8.10.2-all/b56q50gs7qqx1aauwgq4zjvl7/gradle-8.10.2/bin/gradle assembleRelease

APK_PATH="$PROJECT_DIR/android/app/build/outputs/apk/release/app-release.apk"
if [ ! -f "$APK_PATH" ]; then
    echo -e "${RED}构建失败: APK 文件不存在${NC}"
    exit 1
fi

# 3. 上传到文件服务器
echo -e "${YELLOW}[4/6] 上传到文件服务器...${NC}"
UPLOAD_RESPONSE=$(curl -s -X PUT --data-binary @"$APK_PATH" "$FILE_SERVER/upload?filename=food-order-app-v${VERSION}.apk")
echo "上传响应: $UPLOAD_RESPONSE"

STORED_NAME=$(echo "$UPLOAD_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('stored_name', ''))")
DOWNLOAD_URL="$FILE_SERVER/download/$STORED_NAME"

echo -e "${GREEN}下载链接: $DOWNLOAD_URL${NC}"

# 4. 更新本地 main.py 中的下载链接
echo -e "${YELLOW}[5/6] 更新下载链接...${NC}"
cd "$PROJECT_DIR/backend"

# 使用 sed 直接替换下载链接
sed -i "s|\"download_url\":\s*\"[^\"]*\"|\"download_url\": \"${DOWNLOAD_URL}\"|" main.py

echo "下载链接已更新"

# 5. 提交代码
echo -e "${YELLOW}[6/6] 提交并推送代码...${NC}"
cd "$PROJECT_DIR"
git add -A
git commit -m "release: v${VERSION} - ${RELEASE_NOTES}"
git push

# 6. 远程同步到 cloud1 并重启
echo -e "${YELLOW}[7/7] 同步到 cloud1 并重启服务...${NC}"
echo "推送代码到 cloud1..."
# 先推送到远程
git -C "$PROJECT_DIR" push

# SSH 到 cloud1 拉取最新代码并重启
echo "SSH 到 cloud1 拉取最新代码..."
ssh -o StrictHostKeyChecking=no $CLOUD1_HOST << 'SSHEOF'
    cd /home/admin/.openclaw/workspace/food-order-app
    git pull origin main
    
    # 使用 systemctl 重启后端服务
    sudo systemctl restart food-order-app
    echo "后端服务已重启"
    sleep 2
    sudo systemctl status food-order-app --no-pager | head -5
SSHEOF

echo ""
echo -e "${GREEN}=== 发布完成! ===${NC}"
echo ""
echo "APK: $DOWNLOAD_URL"
echo "版本: v${VERSION}"
echo ""
echo -e "${GREEN}服务已在 cloud1 上自动重启！${NC}"