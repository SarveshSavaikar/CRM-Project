from typing import Optional
from datetime import datetime, date
from pydantic import BaseModel, Field

class KPIMetricsResponse(BaseModel):
    lead_count: int
    conversion_rate: float
    opportunity_count: int
    total_opportunity_value: float

    class Config:
        from_attributes = True

class EntityByAttributeResponse(BaseModel):
    group_by: str
    group: list[str]
    count: list[int]
            
