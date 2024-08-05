import uuid
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy.ext.asyncio import AsyncSession
from swarmstar.constants.misc_constants import SWARM_ID_LENGTH
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from data.models.swarmstar_space_model import SwarmstarSpaceModel
from swarmstar.objects.operations.base_operation import BaseOperation
from data import Database

async def generate_id(db: Database, table: DatabaseTableEnum, swarm_id: Optional[str] = None) -> str:
    """
    Swarmstars data model enforces an id schema that makes many operations simpler.
    
    The SwarmstarSpace being the sort of main class encompassing all objects has an id.
    Then all operations and nodes within a swarmstar space have the following schema:
    
    {swarm_id}_{table_abbreviation}{x}
    
    Where x is a number that is incremented every time a new object of that type is created in this swarm.
    """
    from swarmstar.constants.database_constants import TABLE_ENUM_TO_ABBREVIATION, TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN
    if table == DatabaseTableEnum.SWARMSTAR_SPACE:
        return uuid.uuid4().hex
    if swarm_id is None:
        raise ValueError(f"swarm_id is required to create an id for {table}")
    identifier = TABLE_ENUM_TO_ABBREVIATION[table]
    count_column_name = TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN[table]
    async with db.get_session() as session:
        x = await get_swarm_object_count(db, swarm_id, table, session)
        await db.update(SwarmstarSpaceModel, swarm_id, {count_column_name: (x + 1)}, session)
    return f"{swarm_id}_{identifier}{x}"

async def get_swarm_object_count(db: Database, swarm_id: str, table: DatabaseTableEnum, session: Optional[AsyncSession] = None) -> int:
    """
    This function gets the current count of an object in a given swarm.
    """
    from swarmstar.constants.database_constants import TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN
    count_column_name = TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN[table]
    if count_column_name is None:
        raise ValueError(f"No count column for table {table}")
    if session is None:
        session = db.get_session()
    async with session as session:
        result = await db.select(SwarmstarSpaceModel, swarm_id, [count_column_name], session)
        return result[count_column_name]

async def get_all_swarm_object_ids(db: Database, swarm_id: str, table: DatabaseTableEnum, session: Optional[AsyncSession] = None) -> Optional[List[str]]:
    from swarmstar.constants.database_constants import TABLE_ENUM_TO_ABBREVIATION, TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN
    count_column_name = TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN[table]
    if count_column_name is None:
        return None
    if session is None:
        session = db.get_session()
    async with session as session:
        x = await get_swarm_object_count(db, swarm_id, table, session)
        return [f"{swarm_id}_{TABLE_ENUM_TO_ABBREVIATION[table]}{i}" for i in range(x)]

def extract_swarm_id(id: str) -> str:
    return id[:SWARM_ID_LENGTH]

def get_table_enum_from_id(id: str) -> DatabaseTableEnum:
    from swarmstar.constants.database_constants import TABLE_ABBREVIATION_TO_ENUM
    table_identifier = id[SWARM_ID_LENGTH+2:SWARM_ID_LENGTH+4]
    return TABLE_ABBREVIATION_TO_ENUM[table_identifier]

def get_table_name_from_id(id: str) -> str:
    from swarmstar.constants.database_constants import TABLE_ENUM_TO_TABLE_NAME
    table_enum = get_table_enum_from_id(id)
    return TABLE_ENUM_TO_TABLE_NAME[table_enum]

def get_operation_class_from_id(id: str) -> BaseOperation:
    from swarmstar.constants.database_constants import TABLE_ENUM_TO_OBJECT_CLASS
    table_enum = get_table_enum_from_id(id)
    return TABLE_ENUM_TO_OBJECT_CLASS[table_enum]
