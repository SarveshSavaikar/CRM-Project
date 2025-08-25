from fastapi import APIRouter, Depends, HTTPException
from databases import Database
from app.database.connection import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.services import product_service

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("/", response_model=list[ProductResponse])
async def list_products(
    name: str = None,
    min_price: float = None,
    max_price: float = None,
    db: Database = Depends(get_db)
):
    return await product_service.get_products(db, name=name, min_price=min_price, max_price=max_price)

@router.post("/", response_model=ProductResponse)
async def create_product(product: ProductCreate, db: Database = Depends(get_db)):
    return await product_service.create_product(db, product)

@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: int, db: Database = Depends(get_db)):
    product = await product_service.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, product: ProductUpdate, db: Database = Depends(get_db)):
    updated = await product_service.update_product(db, product_id, product)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@router.delete("/{product_id}")
async def delete_product(product_id: int, db: Database = Depends(get_db)):
    deleted = await product_service.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"detail": f"Product {deleted['id']} deleted"}