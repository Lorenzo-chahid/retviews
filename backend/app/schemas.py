from pydantic import BaseModel
from typing import Optional, List


class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int

    class Config:
        from_attributes = True  # Correction ici


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int


class ClothingCategoryBase(BaseModel):
    name: str


class ClothingCategory(ClothingCategoryBase):
    id: int

    class Config:
        from_attributes = True  # Correction ici


class ClothingItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    category_id: int


# Si vous avez besoin d'un schéma pour créer un ClothingItem, incluant user_id
class ClothingItemCreate(ClothingItemBase):
    user_id: int


class ClothingItem(ClothingItemBase):
    id: int
    category: Optional[
        ClothingCategory
    ]  # Référence au schéma de catégorie pour inclure les détails de la catégorie

    class Config:
        from_attributes = True  # Correction ici
