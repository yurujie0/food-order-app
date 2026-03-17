#!/bin/bash
# 启动 FastAPI 后端

cd "$(dirname "$0")"

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "创建虚拟环境..."
    python3 -m venv venv
fi

# 激活虚拟环境
source venv/bin/activate

# 安装依赖
echo "安装依赖..."
pip install -r requirements.txt -q

# 启动服务
echo "启动 FastAPI 服务..."
echo "API 地址: http://localhost:18000"
echo "文档地址: http://localhost:18000/docs"
echo ""

uvicorn main:app --host 0.0.0.0 --port 11170 --reload
