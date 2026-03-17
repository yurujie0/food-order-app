# 使用 Ubuntu 基础镜像
FROM ubuntu:22.04

# 安装基础依赖
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    unzip \
    openjdk-11-jdk \
    nodejs \
    npm \
    git \
    && rm -rf /var/lib/apt/lists/*

# 设置 Java 环境
ENV JAVA_HOME=/usr/lib/jvm/java-11-openjdk-amd64
ENV PATH=$PATH:$JAVA_HOME/bin

# 安装 Android SDK
RUN mkdir -p /opt/android-sdk && cd /opt/android-sdk && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip -q commandlinetools-linux-9477386_latest.zip && \
    rm commandlinetools-linux-9477386_latest.zip

ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$PATH:$ANDROID_HOME/cmdline-tools/bin:$ANDROID_HOME/platform-tools

# 接受许可证并安装 SDK
RUN yes | sdkmanager --licenses && \
    sdkmanager "platforms;android-33" "build-tools;33.0.0" "platform-tools"

# 设置工作目录
WORKDIR /app

# 复制项目文件
COPY . .

# 安装依赖
RUN npm install --legacy-peer-deps

# 生成 Android 项目并构建
RUN npx expo prebuild --platform android && \
    cd android && \
    ./gradlew assembleRelease

# 复制 APK 到输出目录
RUN mkdir -p /app/output && \
    cp /app/android/app/build/outputs/apk/release/app-release.apk /app/output/ 2>/dev/null || \
    cp /app/android/app/build/outputs/apk/debug/app-debug.apk /app/output/app-debug.apk
