from sqlalchemy import event
from sqlalchemy.orm import Session
from sqlalchemy.schema import Table
import asyncio
from swarmstar.enums.database_table_enum import DatabaseTableEnum

from data.models.swarmstar_event_model import SwarmstarEventModel
from swarmstar.utils.misc.ids import (
    extract_swarm_id, 
    generate_id, 
    get_table_name_from_id
)
from swarmstar.constants.constants import (
    TABLE_ENUMS_TO_LISTEN_TO, 
    TABLE_ENUM_TO_MODEL_CLASS
)
from data.database import Database

db = Database()

def log_swarmwstar_event_sync(mapper, connection, target):
    loop = asyncio.get_event_loop()
    event_name = connection.info.get('event_name')
    loop.run_until_complete(log_swarmstar_event(mapper, connection, target, event_name))

async def log_swarmstar_event(mapper, connection, target: Table, event_name: str):
    target_id = getattr(target, 'id', None)
    if target_id is None:
        return
    swarmstar_space_id = extract_swarm_id(target_id)
    table_name = get_table_name_from_id(target_id)

    id = generate_id(DatabaseTableEnum.SWARMSTAR_EVENTS, swarmstar_space_id)
    history_entry = SwarmstarEventModel(
        id=id,
        operation=event_name,
        data=target.__dict__.copy(),
        model_name=table_name
    )

    async with db.get_session() as session:
        await db.create(history_entry, session)
        await session.commit()

for table_enum in TABLE_ENUMS_TO_LISTEN_TO:
    event.listen(TABLE_ENUM_TO_MODEL_CLASS[table_enum], 'after_insert', log_swarmwstar_event_sync, named=True)
    event.listen(TABLE_ENUM_TO_MODEL_CLASS[table_enum], 'after_update', log_swarmwstar_event_sync, named=True)
    event.listen(TABLE_ENUM_TO_MODEL_CLASS[table_enum], 'after_delete', log_swarmwstar_event_sync, named=True)
