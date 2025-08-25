from sqlalchemy import func, literal_column, select
from app.database.models import User, Lead, Opportunity, Campaign, Customer, Interaction, Team, PipelineStage
from sqlalchemy import Table
from sqlalchemy.sql.selectable import Select
def prefix_columns(table, prefix: str):
    if prefix:
        prefix += "_"
    return [col.label(f"{prefix}{col.name}") for col in table.c]

GROUP_BY_MAP_COUNT = {
    Opportunity:{
        "stage": (
            [PipelineStage.c.stage, func.count().label("count")],
            Opportunity.join(PipelineStage, Opportunity.c.pipeline_stage_id == PipelineStage.c.id),
            PipelineStage.c.stage
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
        ),
    }
}

GROUP_BY_MAP = {
    Opportunity:{
        "stage": (
            [PipelineStage.c.stage,
                func.jsonb_agg(
                    func.jsonb_build_object(
                        literal_column("'id'"), Opportunity.c.id,
                        literal_column("'name'"), Opportunity.c.name,
                        literal_column("'value'"), Opportunity.c.value,
                        literal_column("'close_date'"), Opportunity.c.close_date,
                        literal_column("'created_at'"), Opportunity.c.created_at,
                        literal_column("'lead_id'"), Opportunity.c.lead_id,
                        literal_column("'pipeline_stage_id'"), Opportunity.c.pipeline_stage_id,
                    )
                ).label("deals")],
            Opportunity.join(PipelineStage, Opportunity.c.pipeline_stage_id == PipelineStage.c.id),
            PipelineStage.c.stage
        ),
        "lead": (
            [Lead.c.name],
            Opportunity.join(Lead, Opportunity.c.lead_id == Lead.c.id)
        ),
        "month": (
            [
                (month_expr := func.date_trunc("month", Opportunity.c.created_at)).label("month"),
                func.jsonb_agg(
                    func.jsonb_build_object(
                        literal_column("'id'"), Opportunity.c.id,
                        literal_column("'name'"), Opportunity.c.name,
                        literal_column("'value'"), Opportunity.c.value,
                        literal_column("'close_date'"), Opportunity.c.close_date,
                        literal_column("'created_at'"), Opportunity.c.created_at,
                        literal_column("'lead_id'"), Opportunity.c.lead_id,
                        literal_column("'pipeline_stage'"), PipelineStage.c.stage,
                    )
                ).label("deals")
            ],
            Opportunity.join(PipelineStage, Opportunity.c.pipeline_stage_id == PipelineStage.c.id),
            month_expr
        )
    },
    Lead:{
        "source": (
            [Lead.c.source],
            Lead,
            Lead.c.source
        )
    }
}


def build_group_by_query(primary_table: Table, group_by: str, count: bool) -> Select:
    if group_by not in GROUP_BY_MAP[primary_table]:
        raise ValueError(f"Invalid group_by: {group_by}")
    if count:
        select_params, from_table, group_by_col = GROUP_BY_MAP_COUNT[primary_table][group_by]
    else:
        select_params, from_table, group_by_col = GROUP_BY_MAP[primary_table][group_by]
    query = (
        select(*select_params)
        .select_from(from_table)
        .group_by(group_by_col)
    )
    return query