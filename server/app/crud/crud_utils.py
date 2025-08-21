from sqlalchemy import func, select
from app.database.models import User, Lead, Opportunity, Campaign, Customer, Interaction, Team, PipelineStage
from sqlalchemy import Table
def prefix_columns(table, prefix: str):
    if prefix:
        prefix += "_"
    return [col.label(f"{prefix}{col.name}") for col in table.c]

GROUP_BY_MAP = {
    Opportunity:{
        "stage": (
            [PipelineStage.c.name, func.count().label("count")],
            Opportunity.join(PipelineStage, Opportunity.c.pipeline_stage_id == PipelineStage.c.id),
            PipelineStage.c.name
        ),
        "lead": (
            Lead.c.name,
            Opportunity.join(Lead, Opportunity.c.lead_id == Lead.c.id)
        )
    },
    Lead:{
        "source": (
            [Lead.c.source, func.count().label("count")],
            Lead,
            Lead.c.source
        )
    }
}


def build_group_by_query(primary_table: Table, group_by: str):
    if group_by not in GROUP_BY_MAP[primary_table]:
        raise ValueError(f"Invalid group_by: {group_by}")

    select_params, from_table, group_by_col = GROUP_BY_MAP[primary_table][group_by]
    query = (
        select(*select_params)
        .select_from(from_table)
        .group_by(group_by_col)
    )
    return query