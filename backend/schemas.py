from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ========== 用户相关 ==========

class UserBase(BaseModel):
    email: str
    name: str
    phone: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: str
    role: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ========== 菜品相关 ==========

class DishBase(BaseModel):
    name: str
    price: float
    category: str
    description: str
    image: str
    is_available: bool = True


class DishCreate(DishBase):
    pass


class DishUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    is_available: Optional[bool] = None


class DishResponse(DishBase):
    id: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ========== 订单相关 ==========

class OrderItemCreate(BaseModel):
    dish_id: str
    quantity: int


class OrderItemResponse(BaseModel):
    id: int
    dish_id: str
    dish_name: str
    price: float
    quantity: int
    
    class Config:
        from_attributes = True


class OrderCreate(BaseModel):
    items: List[OrderItemCreate]
    note: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    status: str


class OrderResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    total_amount: float
    status: str
    note: Optional[str]
    items: List[OrderItemResponse]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ========== 购物车相关 ==========

class CartItem(BaseModel):
    dish_id: str
    quantity: int


class CartItemResponse(BaseModel):
    dish: DishResponse
    quantity: int


# ========== 版本相关 ==========

class VersionResponse(BaseModel):
    version: str
    version_code: int
    download_url: str
    release_notes: str
    force_update: bool
