from pydantic import BaseModel
from typing import Optional


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        from_attributs = True


class Token(BaseModel):
    access_token: str
    token_type: str


class ClothingCategoryBase(BaseModel):
    name: str


class ClothingItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class ClothingItem(ClothingItemBase):
    id: Optional[int] = None
    category: ClothingCategoryBase

    class Config:
        from_attributes = True
