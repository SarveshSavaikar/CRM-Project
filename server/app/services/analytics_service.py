import math
from fastapi import HTTPException
# from app.schemas.analytics import 
from datetime import date, datetime, time
from databases import Database
from datetime import date
from . import lead_service, opportunity_service, user_service

async def get_kpi_metrics(db: Database):
    lead_count = await lead_service.get_leads(db, count=True)
    opp_count = await opportunity_service.get_opportunities(db, count=True)
    total_opp_value = await opportunity_service.get_total_opportunity_value(db)
    total_opp_value = float(total_opp_value)
    opp_count_active = await opportunity_service.get_opportunities(db, count=True, active_only=True)
    total_opp_value_active = await opportunity_service.get_total_opportunity_value(db, active_only=True)
    total_opp_value_active = float(total_opp_value_active)
    converted_lead_count = await lead_service.get_leads(db, count=True, status="Converted")
    print(f"Leads: {lead_count}, Converted leads: {converted_lead_count}")
    
    # For testing
    if converted_lead_count == 0:
        converted_lead_count = math.ceil(lead_count/2) # 50%
    
    conversion_rate = (converted_lead_count*1.0/lead_count)*100.0
    
    # Forecast fetch and add
    kpi_metrics = {}
    kpi_metrics["lead_count"] = lead_count
    kpi_metrics["conversion_rate"] = conversion_rate
    kpi_metrics["opportunity_count"] = opp_count
    kpi_metrics["total_opportunity_value"] = total_opp_value
    kpi_metrics["opportunity_count_active"] = opp_count_active
    kpi_metrics["total_opportunity_value_active"] = total_opp_value_active
    print(kpi_metrics)
    return kpi_metrics
    
async def get_leads_by_source(db: Database):
    result = await lead_service.get_leads_grouped(db, group_by="source")
    result["group_by"]="source"
    return result

async def get_deals_by_stage(db: Database, count: bool):
    result = await opportunity_service.get_opportunities_grouped(db, group_by="stage", count=count)
    result["group_by"]="stage"
    return result

async def get_top_performers(db: Database, order_by_lead: bool):
    user_performance = await user_service.get_user_performance(db, order_by_lead)
    return user_performance