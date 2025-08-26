from app.crud import product
from app.schemas.product import ProductCreate, ProductUpdate
from databases import Database

async def get_products(db: Database, name: str = None, min_price: float = None, max_price: float = None):
    return await product.get_products(db, name=name, min_price=min_price, max_price=max_price)

async def create_product(db: Database, product_obj: ProductCreate):
    return await product.create_product(db, product_obj)

async def get_product(db: Database, product_id: int):
    return await product.get_product_by_id(db, product_id)

async def update_product(db: Database, product_id: int, product_obj: ProductUpdate):
    update_data = product_obj.dict(exclude_unset=True)
    return await product.update_product(db, product_id, update_data)

async def delete_product(db: Database, product_id: int):
    return await product.delete_product(db, product_id)

async def get_product_price(db: Database, product_id: int) -> float | None:
    product_record = await product.get_product_by_id(db, product_id)
    if product_record:
        return product_record["base_price"]
    return None