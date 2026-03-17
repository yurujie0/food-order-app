from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from uuid import uuid4
from datetime import datetime

import models
import schemas
from database import engine, get_db, Base
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_admin
)

# 创建数据库表
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Food Order API", version="1.0.0")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制为前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========== 初始化数据 ==========

@app.on_event("startup")
async def startup_event():
    db = next(get_db())
    
    # 检查是否已有管理员
    admin = db.query(models.User).filter(models.User.role == "admin").first()
    if not admin:
        # 创建默认管理员
        admin_user = models.User(
            id=str(uuid4()),
            email="admin@example.com",
            name="管理员",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            phone="13800138000",
        )
        db.add(admin_user)
        
        # 创建默认菜品
        default_dishes = [
            models.Dish(
                id=str(uuid4()),
                name="宫保鸡丁",
                price=38,
                category="hot",
                description="经典川菜，鸡肉嫩滑，花生香脆，微辣可口",
                image="https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400",
                is_available=True,
            ),
            models.Dish(
                id=str(uuid4()),
                name="麻婆豆腐",
                price=22,
                category="hot",
                description="四川名菜，豆腐嫩滑，麻辣鲜香",
                image="https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
                is_available=True,
            ),
            models.Dish(
                id=str(uuid4()),
                name="凉拌黄瓜",
                price=12,
                category="cold",
                description="清爽开胃，蒜香浓郁",
                image="https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=400",
                is_available=True,
            ),
            models.Dish(
                id=str(uuid4()),
                name="蛋炒饭",
                price=15,
                category="staple",
                description="粒粒分明，蛋香四溢",
                image="https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400",
                is_available=True,
            ),
        ]
        for dish in default_dishes:
            db.add(dish)
        
        db.commit()
        print("✓ 初始化数据完成")


# ========== 认证路由 ==========

@app.post("/api/auth/register", response_model=schemas.TokenResponse)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    # 检查邮箱是否已存在
    existing = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # 创建新用户
    new_user = models.User(
        id=str(uuid4()),
        email=user_data.email,
        name=user_data.name,
        hashed_password=get_password_hash(user_data.password),
        role="user",
        phone=user_data.phone,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # 生成 token
    access_token = create_access_token(data={"sub": new_user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user,
    }


@app.post("/api/auth/login", response_model=schemas.TokenResponse)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.id})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user,
    }


@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# ========== 菜品路由 ==========

@app.get("/api/dishes", response_model=List[schemas.DishResponse])
def get_dishes(
    category: str = None,
    available_only: bool = False,
    db: Session = Depends(get_db)
):
    query = db.query(models.Dish)
    
    if category and category != "all":
        query = query.filter(models.Dish.category == category)
    
    if available_only:
        query = query.filter(models.Dish.is_available == True)
    
    dishes = query.all()
    return dishes


@app.get("/api/dishes/{dish_id}", response_model=schemas.DishResponse)
def get_dish(dish_id: str, db: Session = Depends(get_db)):
    dish = db.query(models.Dish).filter(models.Dish.id == dish_id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    return dish


@app.post("/api/dishes", response_model=schemas.DishResponse)
def create_dish(
    dish_data: schemas.DishCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    new_dish = models.Dish(
        id=str(uuid4()),
        **dish_data.dict()
    )
    db.add(new_dish)
    db.commit()
    db.refresh(new_dish)
    return new_dish


@app.put("/api/dishes/{dish_id}", response_model=schemas.DishResponse)
def update_dish(
    dish_id: str,
    dish_data: schemas.DishUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    dish = db.query(models.Dish).filter(models.Dish.id == dish_id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    
    update_data = dish_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(dish, key, value)
    
    db.commit()
    db.refresh(dish)
    return dish


@app.delete("/api/dishes/{dish_id}")
def delete_dish(
    dish_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    dish = db.query(models.Dish).filter(models.Dish.id == dish_id).first()
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    
    db.delete(dish)
    db.commit()
    return {"message": "Dish deleted"}


# ========== 订单路由 ==========

@app.get("/api/orders", response_model=List[schemas.OrderResponse])
def get_orders(
    status: str = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 管理员看所有，普通用户只看自己的
    if current_user.role == "admin":
        query = db.query(models.Order)
    else:
        query = db.query(models.Order).filter(models.Order.user_id == current_user.id)
    
    if status and status != "all":
        query = query.filter(models.Order.status == status)
    
    orders = query.order_by(models.Order.created_at.desc()).all()
    return orders


@app.get("/api/orders/{order_id}", response_model=schemas.OrderResponse)
def get_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # 检查权限
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Permission denied")
    
    return order


@app.post("/api/orders", response_model=schemas.OrderResponse)
def create_order(
    order_data: schemas.OrderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # 计算总价并验证菜品
    total_amount = 0
    order_items = []
    
    for item in order_data.items:
        dish = db.query(models.Dish).filter(models.Dish.id == item.dish_id).first()
        if not dish:
            raise HTTPException(status_code=404, detail=f"Dish {item.dish_id} not found")
        if not dish.is_available:
            raise HTTPException(status_code=400, detail=f"Dish {dish.name} is not available")
        
        total_amount += dish.price * item.quantity
        order_items.append({
            "dish_id": dish.id,
            "dish_name": dish.name,
            "price": dish.price,
            "quantity": item.quantity,
        })
    
    # 创建订单
    new_order = models.Order(
        id=str(uuid4()),
        user_id=current_user.id,
        user_name=current_user.name,
        total_amount=total_amount,
        status="pending",
        note=order_data.note,
    )
    db.add(new_order)
    db.flush()  # 获取 order id
    
    # 创建订单项
    for item_data in order_items:
        order_item = models.OrderItem(
            order_id=new_order.id,
            **item_data
        )
        db.add(order_item)
    
    db.commit()
    db.refresh(new_order)
    return new_order


@app.put("/api/orders/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(
    order_id: str,
    status_data: schemas.OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # 用户只能取消自己的待处理订单
    if current_user.role != "admin":
        if order.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Permission denied")
        if status_data.status != "cancelled" or order.status != "pending":
            raise HTTPException(status_code=400, detail="Can only cancel pending orders")
    
    order.status = status_data.status
    order.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(order)
    return order


@app.delete("/api/orders/{order_id}")
def delete_order(
    order_id: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    db.delete(order)
    db.commit()
    return {"message": "Order deleted"}


# ========== 统计路由 ==========

@app.get("/api/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin)
):
    from sqlalchemy import func
    
    # 今日订单统计
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    
    total_orders = db.query(models.Order).count()
    pending_orders = db.query(models.Order).filter(models.Order.status == "pending").count()
    preparing_orders = db.query(models.Order).filter(models.Order.status == "preparing").count()
    completed_orders = db.query(models.Order).filter(models.Order.status == "completed").count()
    
    today_revenue = db.query(func.sum(models.Order.total_amount)).filter(
        models.Order.created_at >= today,
        models.Order.status != "cancelled"
    ).scalar() or 0
    
    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "preparing_orders": preparing_orders,
        "completed_orders": completed_orders,
        "today_revenue": today_revenue,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=18000)