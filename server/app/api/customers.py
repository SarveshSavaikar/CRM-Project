from fastapi import APIRouter, Depends
# from sqlalchemy.orm import Session
from databases import Database
from app.database.connection import get_db
from app.schemas.customer import CustomerCreate, CustomerUpdate, CustomerResponse
from app.services import customer_service
from datetime import date , datetime

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/", response_model=list[CustomerResponse])
async def get_customer(
    description: str = None,
    industry: str = None, 
    lead_id: int = None, 
    created: datetime = None, 
    last_updated: datetime = None, 
    before: bool = True, 
    db: Database = Depends(get_db)
):
    return await customer_service.get_customers(db, description, industry, lead_id, created, last_updated, before)


@router.get("/customer-{customer_id}", response_model=CustomerResponse)
async def get_customer(customer_id: int, db: Database = Depends(get_db)):
    return await customer_service.get_customer(db, customer_id)


@router.post("/create-customer", response_model=CustomerResponse)
async def create_customer(customer: CustomerCreate, db: Database = Depends(get_db)):
    return await customer_service.create_customer(db, customer)

@router.put("/{customer_id}", response_model=CustomerResponse)
async def update_customer(customer_id: int, customer: CustomerUpdate, db: Database = Depends(get_db)):    
    return await customer_service.update_customer(db, customer_id, customer)

@router.delete("/{customer_id}")
async def delete_customer(customer_id: int, db: Database = Depends(get_db)):
    return await customer_service.delete_customer(db, customer_id)

