from sqlalchemy import Table, select, insert, update, delete
from app.database.models import Product
from app.schemas.product import ProductCreate, ProductUpdate
from databases import Database

async def get_products(db: Database, name: str = None, min_price: float = None, max_price: float = None):
    query = select(Product)
    if name or min_price is not None or max_price is not None:
        conditions = []
        if name:
            conditions.append(Product.c.name.ilike(f"%{name}%"))
        if min_price is not None:
            conditions.append(Product.c.base_price >= min_price)
        if max_price is not None:
            conditions.append(Product.c.base_price <= max_price)
        query = query.where(*conditions)
    rows = await db.fetch_all(query)
    return [dict(row) for row in rows]

async def create_product(db: Database, product_obj: ProductCreate):
    query = insert(Product).values(
        name=product_obj.name,
        description=product_obj.description,
        base_price=product_obj.base_price,
        currency=product_obj.currency
    ).returning(Product.c.id)
    product_id = await db.execute(query)
    return {**product_obj.dict(), "id": product_id}

async def get_product_by_id(db: Database, product_id: int):
    query = select(Product).where(Product.c.id == product_id)
    row = await db.fetch_one(query)
    return dict(row) if row else None

async def update_product(db: Database, product_id: int, update_data: dict):
    query = (
        update(Product)
        .where(Product.c.id == product_id)
        .values(**update_data)
        .returning(Product)
    )
    row = await db.fetch_one(query)
    return dict(row) if row else None

async def delete_product(db: Database, product_id: int):
    query = delete(Product).where(Product.c.id == product_id).returning(Product.c.id)
    deleted_id = await db.execute(query)
    return {"id": deleted_id} if deleted_id else None