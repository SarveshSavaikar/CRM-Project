from app.crud import lead
from app.schemas.lead import LeadCreate
from sqlalchemy.orm import Session


def get_lead(db: Session, lead_id: int):
    return lead.get_lead_by_id(db, lead_id)

def get_lead(db: Session, role: str, team_id: int):
    if role and team_id:
        return lead.get_lead_by_role_team(db, role, team_id)
    elif role:
        return lead.get_lead_by_role(db, role)
    elif team_id:
        return lead.get_lead_by_role(db, team_id)
    else:
        return lead.get_all_leads(db)