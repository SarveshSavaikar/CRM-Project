def prefix_columns(table, prefix: str):
    if prefix:
        prefix += "_"
    return [col.label(f"{prefix}{col.name}") for col in table.c]