from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # user, admin
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    orders = relationship("Order", back_populates="user")


class Dish(Base):
    __tablename__ = "dishes"
    
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String, nullable=False)  # hot, cold, soup, staple, drink, dessert
    description = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    order_items = relationship("OrderItem", back_populates="dish", cascade="all, delete-orphan")


class Order(Base):
    __tablename__ = "orders"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    user_name = Column(String, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, preparing, ready, completed, cancelled
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    order_id = Column(String, ForeignKey("orders.id"), nullable=False)
    dish_id = Column(String, ForeignKey("dishes.id"), nullable=False)
    dish_name = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, nullable=False)
    
    order = relationship("Order", back_populates="items")
    dish = relationship("Dish", back_populates="order_items")
