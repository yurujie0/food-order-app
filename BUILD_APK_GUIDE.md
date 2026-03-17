# Food Order App - APK 构建指南

使用 EAS Build 云服务构建 APK

## 前置要求

- Node.js 16+ 
- npm 或 yarn
- 一个 Expo 账号（免费注册）

## 步骤

### 1. 注册 Expo 账号

访问 https://expo.dev/signup 注册账号

### 2. 在你的电脑上安装 EAS CLI

```bash
npm install -g eas-cli
```

### 3. 登录 Expo

```bash
eas login
```
输入你的 Expo 账号邮箱和密码

### 4. 配置项目

我已经为你配置好了 `eas.json`，内容如下：

```json
{
  "cli": {
    "version": ">= 5.0.0"
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
```

### 5. 开始构建

```bash
cd food-order-app

# 安装依赖
npm install

# 开始构建 APK
eas build -p android --profile preview
```

### 6. 等待构建完成

- 构建过程通常需要 10-20 分钟
- 你可以在 https://expo.dev/builds 查看进度
- 构建完成后会收到邮件通知

### 7. 下载 APK

构建完成后，运行：

```bash
eas build:list
```

找到最新的构建，点击链接下载 APK，或者直接访问 https://expo.dev/builds 下载。

---

## 常见问题

### Q: 构建失败怎么办？
A: 查看构建日志，通常是依赖问题。可以尝试：
```bash
eas build -p android --profile preview --clear-cache
```

### Q: 如何更新 APK？
A: 修改代码后重新运行构建命令即可

### Q: APK 大小多少？
A: 约 50-80MB（包含所有依赖）

---

## 项目文件说明

```
food-order-app/
├── app.json          # Expo 配置
├── eas.json          # EAS 构建配置
├── package.json      # 依赖
├── app/              # 前端代码
├── backend/          # FastAPI 后端
└── ...
```

## 后端服务器

APK 构建完成后，需要确保后端服务器运行：

```bash
cd food-order-app/backend
./start.sh
```

服务器默认运行在 `http://localhost:18000`

**注意**: 如果要在真机上测试，需要：
1. 将手机连接到同一 WiFi
2. 修改 `services/api.ts` 中的 API 地址为电脑 IP
3. 重新构建 APK

---

## 一键脚本

我为你准备了一键构建脚本：

```bash
# 保存为 build.sh
#!/bin/bash
echo "🚀 开始构建 APK..."
echo ""

# 检查 eas
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI 未安装"
    echo "运行: npm install -g eas-cli"
    exit 1
fi

# 检查登录
eas whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "请先登录: eas login"
    exit 1
fi

# 安装依赖
npm install

# 开始构建
echo "📦 开始构建..."
eas build -p android --profile preview

echo ""
echo "✅ 构建已提交到云端"
echo "查看进度: https://expo.dev/builds"
```

运行：
```bash
chmod +x build.sh
./build.sh
```

---

祝你构建顺利！🎉
