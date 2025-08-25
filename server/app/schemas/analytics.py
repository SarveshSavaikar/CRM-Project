from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, Extra, Field

class KPIMetricsResponse(BaseModel):
    lead_count: int
    conversion_rate: float
    opportunity_count: int
    total_opportunity_value: float
    opportunity_count_active: int
    total_opportunity_value_active: float

    class Config:
        from_attributes = True

class EntityByAttributeResponse(BaseModel):
    group_by: str
    
    class Config:
        extra = "allow"
            
