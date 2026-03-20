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
python3 << EOF
import re

with open('main.py', 'r') as f:
    content = f.read()

content = re.sub(
    r'"version":\s*"[^"]*",',
    f'"version": "{VERSION}",',
    content
)
content = re.sub(
    r'"version_code":\s*\d+,',
    f'"version_code": {VERSION_CODE},',
    content
)
content = re.sub(
    r'"download_url":\s*"[^"]*",',
    f'"download_url": "http://8.135.17.245:18000/download/PLACEHOLDER",',
    content
)
content = re.sub(
    r'"release_notes":\s*"[^"]*",',
    f'"release_notes": "{RELEASE_NOTES}",',
    content
)

with open('main.py', 'w') as f:
    f.write(content)

print("本地版本已更新")
EOF

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
python3 << EOF
import re

with open('main.py', 'r') as f:
    content = f.read()

content = re.sub(
    r'"download_url":\s*"[^"]*",',
    f'"download_url": "{DOWNLOAD_URL}",',
    content
)

with open('main.py', 'w') as f:
    f.write(content)

print("下载链接已更新")
EOF

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
    cd /home/yurujie/.openclaw/workspace/food-order-app
    git pull origin main
    
    # 重启后端服务
    pkill -f "python main.py" 2>/dev/null || true
    cd backend
    nohup python3 main.py > /tmp/food_order_backend.log 2>&1 &
    echo "后端服务已重启"
SSHEOF

echo ""
echo -e "${GREEN}=== 发布完成! ===${NC}"
echo ""
echo "APK: $DOWNLOAD_URL"
echo "版本: v${VERSION}"
echo ""
echo -e "${GREEN}服务已在 cloud1 上自动重启！${NC}"