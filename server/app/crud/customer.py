from app.schemas.customer import CustomerCreate, CustomerUpdate
from sqlalchemy import Table, Column, Integer, String, MetaData, and_, select, insert, update
from databases import Database
from sqlalchemy.exc import IntegrityError
from app.database.models import Customer
from typing import Any

# Get customer by ID
async def get_customer_by_id(db: Database, customer_id: int):
    query = select(Customer).where(Customer.c.id == customer_id)
    return await db.fetch_one(query)

async def get_customers(db: Database, **filters: dict[str, Any]) -> list[dict[str, Any]]:
    query = select(Customer)
    conditions = []
    print(query)
    for attr, value in filters.items():
        if value is None:
            continue
        if attr == "created__lt":
            print(value)
            conditions.append(Customer.c.created_at <= value)
        elif attr == "created__gt":
            conditions.append(Customer.c.created_at >= value)
        if attr == "updated__lt":
            print(value)
            conditions.append(Customer.c.updated_at <= value)
        elif attr == "updated__gt":
            conditions.append(Customer.c.updated_at >= value)
        elif hasattr(Customer.c, attr):
            conditions.append(getattr(Customer.c, attr) == value)

    if conditions:
        query = query.where(and_(*conditions))
    rows = await db.fetch_all(query)
    return [dict(row) for row in rows]
    


# Create customer
async def create_customer(db: Database, customer_data: CustomerCreate):
    query = (
        insert(Customer)
        .values(
            name=customer_data.name,
            email=customer_data.email,
            phone=customer_data.phone,
            description=customer_data.description,
            industry=customer_data.industry,
            created_at=customer_data.created_at,
            updated_at=customer_data.updated_at,
            lead_id=customer_data.lead_id
        )
        .returning(Customer)
    )

    try:
        return await db.fetch_one(query)
    except IntegrityError as e:
        raise e

# Update customer
async def update_customer(db: Database, customer_id: int, update_data: dict):
    update_query = (
        Customer
        .update()
        .where(Customer.c.id == customer_id)
        .values(**update_data)
        .returning(Customer)
    )
    updated_customer = await db.fetch_one(update_query)

    return updated_customer

async def delete_customer(db: Database, customer_id: int):
    query = (
        Customer
        .delete()
        .where(Customer.c.id == customer_id)
    )
    
    
    return await db.execute(query)