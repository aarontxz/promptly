from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class HealthResponse(BaseModel):
    status: str
    message: str

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None

class ItemCreate(ItemBase):
    pass

class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

class Item(ItemBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    email: str
    name: str
    picture: Optional[str] = None

class UserCreate(UserBase):
    google_id: Optional[str] = None

class UserUpdate(BaseModel):
    name: Optional[str] = None
    picture: Optional[str] = None
    is_active: Optional[bool] = None

class User(UserBase):
    id: int
    google_id: Optional[str] = None
    is_active: bool = True
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)
