"""
For simplicity, nodes and operations have ids like:

    {swarm_id}_{x}{y}

Where x represents the table storing the object, and y represents the object's index within that table.
"""
import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession

from swarmstar.database import Database
from swarmstar.swarmstar.enums.database_table import DatabaseTable
from swarmstar.swarmstar.constants import (
    SWARM_ID_LENGTH, 
    TABLE_ENUM_TO_ABBREVIATION, 
    TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN,
    TABLE_ABBREVIATION_TO_ENUM,
    TABLE_ENUM_TO_TABLE_NAME
)
from swarmstar.swarmstar.models.swarmstar_space_model import SwarmstarSpaceModel

db = Database()

async def generate_id(table: DatabaseTable, swarm_id: Optional[str] = None) -> str:
    """
    SwarmstarSpace uses uuidv4()
    All other models follow the schema:
    {swarm_id}_{table}_{x}
    """
    if table == DatabaseTable.SWARMSTAR_SPACE:
        return uuid.uuid4().hex
    if swarm_id is None:
        raise ValueError(f"swarm_id is required to create an id for {table}")
    identifier = TABLE_ENUM_TO_ABBREVIATION[table]
    count_column_name = TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN[table]
    async with db.get_session() as session:
        x = await get_swarm_object_count(swarm_id, table, session)
        await db.update(SwarmstarSpaceModel, swarm_id, {count_column_name: (x + 1)}, session)
    return f"{swarm_id}_{identifier}{x}"

async def get_swarm_object_count(swarm_id: str, table: DatabaseTable, session: Optional[AsyncSession] = None) -> int:
    count_column_name = TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN[table]
    if count_column_name is None:
        raise ValueError(f"No count column for table {table}")
    if session is None:
        session = db.get_session()
    async with session as session:
        result = await db.select(SwarmstarSpaceModel, swarm_id, [count_column_name], session)
        return result[count_column_name]

async def get_all_swarm_object_ids(swarm_id: str, table: DatabaseTable, session: Optional[AsyncSession] = None) -> Optional[List[str]]:
    count_column_name = TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN[table]
    if count_column_name is None:
        return None
    if session is None:
        session = db.get_session()
    async with session as session:
        x = await get_swarm_object_count(swarm_id, table, session)
        return [f"{swarm_id}_{TABLE_ENUM_TO_ABBREVIATION[table]}{i}" for i in range(x)]

def extract_swarm_id(id: str) -> str:
    return id[:SWARM_ID_LENGTH]

def get_table_enum_from_id(id: str) -> DatabaseTable:
    table_identifier = id[SWARM_ID_LENGTH+2:SWARM_ID_LENGTH+4]
    return TABLE_ABBREVIATION_TO_ENUM[table_identifier]

def get_table_name_from_id(id: str) -> str:
    table_enum = get_table_enum_from_id(id)
    return TABLE_ENUM_TO_TABLE_NAME[table_enum]
