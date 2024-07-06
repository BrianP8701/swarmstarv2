import asyncio
from typing import Any, Dict, List, Optional, Type, TypeVar
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from swarmstar.swarmstar.enums.database_table import DatabaseTable
from swarmstar.swarmstar.utils.misc.ids import generate_id
from swarmstar.database import Database
from swarmstar.constants import TABLE_ENUM_TO_MODEL_CLASS

db = Database()

T = TypeVar('T', bound='BaseObject')

class BaseObject(BaseModel):
    id: str = ''
    __table__: DatabaseTable = Field(exclude=True)

    def __init__(self, swarm_id: Optional[str] = None, **data: Any):
        super().__init__(**data)
        if not self.id:
            self.id = asyncio.run(generate_id(self.__table__, swarm_id))

    async def create(self, session: Optional[AsyncSession] = None) -> None:
        await db.create(TABLE_ENUM_TO_MODEL_CLASS[self.__table__](**self.model_dump()), session)

    @classmethod
    async def read(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> T:
        node_dict = await db.read(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], id, session)
        return cls(**node_dict.__dict__)

    @classmethod
    async def update(cls, id: str, data: Dict[str, Any], session: Optional[AsyncSession] = None) -> None:
        await db.update(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], id, data, session)

    @classmethod
    async def delete(cls, id: str, session: Optional[AsyncSession] = None) -> None:
        await db.delete(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], id, session)

    async def upsert(self, session: Optional[AsyncSession] = None) -> None:
        await db.upsert(TABLE_ENUM_TO_MODEL_CLASS[self.__table__](**self.model_dump()), session)

    @classmethod
    async def select(cls, id: str, columns: List[str], session: Optional[AsyncSession] = None) -> Dict[str, Any]:
        return await db.select(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], id, columns, session)

    @classmethod
    async def exists(cls, id: str, session: Optional[AsyncSession] = None) -> bool:
        return await db.exists(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], id, session)

    @classmethod
    async def batch_create(cls, models: List[T], session: Optional[AsyncSession] = None) -> None:
        await db.batch_create([TABLE_ENUM_TO_MODEL_CLASS[cls.__table__](**model.model_dump()) for model in models], session)

    @classmethod
    async def batch_update(cls, models: List[Dict[str, Any]], session: Optional[AsyncSession] = None) -> None:
        await db.batch_update(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], models, session)

    @classmethod
    async def batch_delete(cls, ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_delete(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], ids, session)

    @classmethod
    async def batch_copy(cls, old_ids: List[str], new_ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_copy(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], old_ids, new_ids, session)
