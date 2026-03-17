# Food Order App - 本地构建 APK 完整指南

## 前置要求

- Windows / macOS / Linux 电脑
- 安装 Node.js 18+
- 安装 Android Studio（包含 Android SDK）

## 步骤 1：安装 Android Studio

1. 下载 Android Studio：https://developer.android.com/studio
2. 安装时选择：
   - ✅ Android SDK
   - ✅ Android SDK Platform
   - ✅ Android Virtual Device

## 步骤 2：配置环境变量

### Windows
```cmd
setx ANDROID_HOME "%LOCALAPPDATA%\Android\Sdk"
setx PATH "%PATH%;%ANDROID_HOME%\platform-tools"
```

### macOS / Linux
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk  # macOS
# 或
export ANDROID_HOME=$HOME/Android/Sdk  # Linux

export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 步骤 3：获取项目代码

```bash
# 方式一：从服务器下载（需要 SCP/SFTP）
scp -r user@server:/home/admin/.openclaw/workspace/food-order-app ./

# 方式二：如果已下载到本地
cd food-order-app
```

## 步骤 4：安装依赖

```bash
cd food-order-app
npm install
```

## 步骤 5：生成 Android 项目

```bash
npx expo prebuild --platform android
```

这会生成 `android` 文件夹。

## 步骤 6：构建 APK

```bash
cd android

# 清理（可选）
./gradlew clean

# 构建 Release APK
./gradlew assembleRelease

# 或构建 Debug APK（更快）
./gradlew assembleDebug
```

## 步骤 7：获取 APK

构建完成后，APK 文件位于：

- **Release**: `android/app/build/outputs/apk/release/app-release.apk`
- **Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`

## 常见问题

### 1. Gradle 下载慢

编辑 `android/gradle/wrapper/gradle-wrapper.properties`，修改：
```properties
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.8-all.zip
```

### 2. 缺少 SDK

在 Android Studio 中打开 SDK Manager，安装：
- Android SDK Platform 33
- Android SDK Build-Tools 33.0.0
- Android SDK Command-line Tools

### 3. 签名问题（Release）

创建签名密钥：
```bash
cd android/app
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

在 `android/app/build.gradle` 中添加：
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file("my-release-key.keystore")
            storePassword "your-password"
            keyAlias "my-key-alias"
            keyPassword "your-password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## 快速脚本

创建 `build-apk.sh`：

```bash
#!/bin/bash
set -e

echo "🚀 开始构建 APK..."

# 安装依赖
echo "📦 安装依赖..."
npm install

# 生成 Android 项目
echo "🔧 生成 Android 项目..."
npx expo prebuild --platform android

# 构建 APK
echo "🏗️ 构建 APK..."
cd android
./gradlew assembleRelease

echo "✅ 构建完成！"
echo "APK 路径: $(pwd)/app/build/outputs/apk/release/app-release.apk"
echo "文件大小: $(ls -lh app/build/outputs/apk/release/app-release.apk | awk '{print $5}')"
```

运行：
```bash
chmod +x build-apk.sh
./build-apk.sh
```

## 安装到手机

```bash
# 连接手机（开启 USB 调试）
adb devices

# 安装 APK
adb install android/app/build/outputs/apk/release/app-release.apk
```

## 后端服务器

记得启动后端服务器：
```bash
cd food-order-app/backend
./start.sh
```

手机需要连接同一 WiFi 才能访问后端。

---

祝你构建顺利！🎉
