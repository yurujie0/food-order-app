# 点菜 APP (Food Order App)

基于 React Native + Expo + FastAPI + SQLite 的点餐应用。

## 技术栈

- **前端**: React Native + Expo + TypeScript
- **后端**: FastAPI + SQLAlchemy + SQLite
- **认证**: JWT Token

## 项目结构

```
food-order-app/
├── app/                    # 前端页面
│   ├── (auth)/            # 认证页面
│   ├── (user)/            # 用户端
│   └── (admin)/           # 管理端
├── backend/               # FastAPI 后端
│   ├── main.py           # 主入口
│   ├── models.py         # 数据库模型
│   ├── schemas.py        # Pydantic 模型
│   ├── auth.py           # 认证相关
│   └── database.py       # 数据库配置
├── components/            # 组件
├── hooks/                 # 自定义 Hooks
├── services/              # API 服务
├── types/                 # TypeScript 类型
└── constants/             # 常量
```

## 快速开始

### 1. 启动后端

```bash
cd food-order-app/backend

# 方式一：使用脚本
./start.sh

# 方式二：手动
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

后端启动后会自动：
- 创建 SQLite 数据库 (`food_order.db`)
- 初始化管理员账号：`admin@example.com` / `admin123`
- 添加默认菜品数据

API 地址：
- 服务地址：`http://localhost:8000`
- API 文档：`http://localhost:8000/docs`

### 2. 启动前端

```bash
cd food-order-app

# 安装依赖
npm install

# 启动 Expo
npx expo start
```

按 `w` 打开 Web 版本，或用手机 Expo Go 扫描 QR 码。

## 测试账号

| 角色 | 邮箱 | 密码 |
|-----|------|------|
| 管理员 | `admin@example.com` | `admin123` |
| 普通用户 | 自行注册 | - |

## API 端点

### 认证
- `POST /api/auth/register` - 注册
- `POST /api/auth/login` - 登录
- `GET /api/auth/me` - 获取当前用户

### 菜品
- `GET /api/dishes` - 获取菜品列表
- `GET /api/dishes/{id}` - 获取单个菜品
- `POST /api/dishes` - 创建菜品（管理员）
- `PUT /api/dishes/{id}` - 更新菜品（管理员）
- `DELETE /api/dishes/{id}` - 删除菜品（管理员）

### 订单
- `GET /api/orders` - 获取订单列表
- `POST /api/orders` - 创建订单
- `PUT /api/orders/{id}/status` - 更新订单状态

### 统计
- `GET /api/stats` - 获取统计数据（管理员）

## 功能特性

### 用户端
- ✅ 注册/登录
- ✅ 浏览菜品（分类筛选、搜索）
- ✅ 购物车管理
- ✅ 下单支付
- ✅ 查看订单状态

### 管理端
- ✅ 仪表盘统计
- ✅ 菜品管理（增删改查）
- ✅ 订单管理（状态更新）

## 数据存储

| 数据 | 存储位置 | 说明 |
|-----|---------|------|
| 用户、菜品、订单 | SQLite (云端) | 通过 FastAPI 访问 |
| 购物车 | AsyncStorage (本地) | 仅当前设备 |
| Token | AsyncStorage (本地) | 登录凭证 |

## 开发说明

### 后端开发

```bash
cd backend
source venv/bin/activate

# 查看 API 文档
open http://localhost:8000/docs

# 测试 API
curl http://localhost:8000/api/dishes
```

### 前端开发

```bash
# 模拟器/真机调试
npx expo start --android   # Android
npx expo start --ios       # iOS (仅 Mac)
npx expo start --web       # Web 版本

# 清除缓存
npx expo start -c
```

### 数据库管理

SQLite 数据库文件位于 `backend/food_order.db`，可以使用任何 SQLite 客户端查看：

```bash
# 命令行
sqlite3 food_order.db
.tables
SELECT * FROM users;
```

## 部署

### 后端部署

```bash
# 生产环境
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

### 前端部署

```bash
# 构建 Web 版本
npx expo export:web

# 或构建独立 App
npx eas build --platform android
npx eas build --platform ios
```

## 许可证

MIT
