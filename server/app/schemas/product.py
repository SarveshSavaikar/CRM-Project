from pydantic import BaseModel, Field
from typing import Optional

class ProductBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    base_price: float
    currency: str = "INR"

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    currency: Optional[str] = "INR"

class ProductResponse(ProductBase):
    id: int

    class Config:
        orm_mode = True