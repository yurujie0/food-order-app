# Food Order App - EAS Build 最终指南

## 问题
当前环境无法完成交互式 EAS 配置，需要你在本地终端执行。

## 快速构建步骤

### 1. 进入项目目录
```bash
cd food-order-app
```

### 2. 配置 EAS 项目（只需一次）
```bash
npx eas build:configure -p android
```
按提示操作：
- 选择 `y` 创建 EAS 项目
- 等待配置完成

### 3. 开始构建
```bash
npx eas build -p android --profile preview
```

### 4. 等待完成
- 构建时间：10-20 分钟
- 查看进度：https://expo.dev/builds

### 5. 下载 APK
构建完成后运行：
```bash
npx eas build:list --limit 1
```
复制下载链接到浏览器下载 APK。

---

## 项目当前状态

✅ 已完成：
- React Native + Expo 前端
- FastAPI + SQLite 后端
- JWT 认证
- 用户端功能（点餐、购物车、订单）
- 管理端功能（菜品管理、订单管理）
- EAS 配置 (eas.json)

⚠️ 需要你在本地执行：
- EAS 项目初始化
- 云端构建

---

## 构建完成后

1. 下载 APK 到手机安装
2. 确保后端服务器运行：
   ```bash
   cd backend
   ./start.sh
   ```
3. 手机连接同一 WiFi 即可使用

---

## 测试账号

- 管理员：`admin@example.com` / `admin123`
- 普通用户：自行注册

---

## 文件位置

```
/home/admin/.openclaw/workspace/food-order-app/
├── app/              # 前端代码
├── backend/          # FastAPI 后端
├── eas.json          # EAS 配置
├── app.json          # Expo 配置
└── package.json      # 依赖
```

祝构建顺利！🎉
