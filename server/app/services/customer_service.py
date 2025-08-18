from fastapi import HTTPException
from app.crud import customer
from app.schemas.customer import CustomerCreate, CustomerUpdate
from datetime import date, datetime, time
from databases import Database
from typing import Optional
from datetime import date

async def get_customer(db: Database, customer_id: int):
    result = await customer.get_customer_by_id(db, customer_id)
    
    if not result:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    return result


async def get_customers(
    db: Database,
    company: str,
    industry: str, 
    lead_id: int, 
    created: date, 
    last_updated: date, 
    before: bool
):
    filters = {}

    if company is not None:
        filters["company"] = company
    if industry is not None:
        filters["industry"] = industry
    if lead_id is not None:
        filters["lead_id"] = lead_id
    if before is True and created is not None:
        filters["created__lt"] = datetime.combine(created, time.max)
    elif before is False and created is not None:
        filters["created__gt"] = datetime.combine(created, time.max)
    if before is True and last_updated is not None:
        filters["updated__lt"] = datetime.combine(last_updated, time.max)
    elif before is False and created is not None:   
        filters["updated__gt"] = datetime.combine(last_updated, time.max)

    return await customer.get_customers(db, **filters)

async def update_customer(db: Database, customer_id: str, customerObj: CustomerUpdate):
    result = await customer.get_customer_by_id(db, customer_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    update_data = customerObj.model_dump(exclude_unset=True)
    
    return await customer.update_customer(db, customer_id, update_data)
    
async def create_customer(db: Database, customerObj: CustomerCreate):
    return await customer.create_customer(db, customerObj)

async def delete_customer(db: Database, customer_id: int):
    return await customer.delete_customer(db, customer_id)