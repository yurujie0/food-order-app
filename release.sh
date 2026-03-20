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
API_BASE_URL="http://8.135.17.245:11170"
FILE_SERVER="http://8.135.17.245:18000"
JAVA_HOME="/usr/lib/jvm/java-17-openjdk-amd64"

# 检查参数
if [ $# -lt 3 ]; then
    echo -e "${RED}用法: $0 <版本号> <version_code> <更新说明>${NC}"
    echo -e "示例: $0 1.7 7 '修复图标显示问题'"
    exit 1
fi

VERSION=$1
VERSION_CODE=$2
RELEASE_NOTES=$3

echo -e "${GREEN}=== Food Order App 发布脚本 ===${NC}"
echo -e "版本: v${VERSION} (${VERSION_CODE})"
echo -e "更新: ${RELEASE_NOTES}"
echo ""

# 1. 清理并重新生成 Android 项目
echo -e "${YELLOW}[1/6] 清理并生成 Android 项目...${NC}"
cd "$PROJECT_DIR"
rm -rf android
npx expo prebuild --platform android

# 添加 fonts.gradle 配置
if ! grep -q "react-native-vector-icons/fonts.gradle" android/app/build.gradle; then
    sed -i 's/apply plugin: "com.facebook.react"/apply plugin: "com.facebook.react"\n\n\/\/ React Native Vector Icons 字体配置\napply from: file("..\/..\/node_modules\/react-native-vector-icons\/fonts.gradle")/' android/app/build.gradle
fi

# 配置 SDK 路径
echo "sdk.dir=$HOME/android-sdk" > android/local.properties

# 2. 构建 APK
echo -e "${YELLOW}[2/6] 构建 Release APK...${NC}"
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
echo -e "${YELLOW}[3/6] 上传到文件服务器...${NC}"
UPLOAD_RESPONSE=$(curl -s -X PUT --data-binary @"$APK_PATH" "$FILE_SERVER/upload?filename=food-order-app-v${VERSION}.apk")
echo "上传响应: $UPLOAD_RESPONSE"

DOWNLOAD_URL=$(echo "$UPLOAD_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('download_url', ''))" 2>/dev/null || echo "")

if [ -z "$DOWNLOAD_URL" ]; then
    DOWNLOAD_URL="$FILE_SERVER/download/$(echo "$UPLOAD_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin).get('stored_name', ''))" 2>/dev/null)"
fi

echo -e "${GREEN}下载链接: $DOWNLOAD_URL${NC}"

# 4. 更新后端版本信息
echo -e "${YELLOW}[4/6] 更新后端版本信息...${NC}"
cd "$PROJECT_DIR/backend"

# 使用 Python 更新版本信息
python3 << EOF
import re

with open('main.py', 'r') as f:
    content = f.read()

# 找到并替换版本信息
old_pattern = r'(return\s*\{[^}]*"version":\s*")[^"]*(")'
new_version = r'\g<1>' + '$VERSION' + r'\2'

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
    f'"download_url": "{DOWNLOAD_URL}",',
    content
)
content = re.sub(
    r'"release_notes":\s*"[^"]*",',
    f'"release_notes": "{RELEASE_NOTES}",',
    content
)

with open('main.py', 'w') as f:
    f.write(content)

print("后端版本已更新")
EOF

# 5. 提交代码
echo -e "${YELLOW}[5/6] 提交代码...${NC}"
cd "$PROJECT_DIR"
git add -A
git commit -m "release: v${VERSION} - ${RELEASE_NOTES}"

# 6. 推送到远程
echo -e "${YELLOW}[6/6] 推送到 GitHub...${NC}"
git push

echo ""
echo -e "${GREEN}=== 发布完成! ===${NC}"
echo ""
echo "APK: $DOWNLOAD_URL"
echo "版本: v${VERSION}"
echo ""
echo -e "${YELLOW}提示: 请重启后端服务以应用新版本${NC}"
echo "命令: cd $PROJECT_DIR/backend && python main.py"