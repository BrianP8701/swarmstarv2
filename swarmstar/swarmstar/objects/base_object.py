from typing import Any, Dict, List, Type, TypeVar
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from swarmstar.swarmstar.enums.database_collection import DatabaseCollection
from swarmstar.swarmstar.utils.misc.ids import generate_id
from swarmstar.database import Database
from swarmstar.constants import collection_to_model

db = Database()

T = TypeVar('T', bound='BaseObject')

class BaseObject(BaseModel):
    id: str = ''
    collection: DatabaseCollection

    def __init__(self, swarm_id: str | None = None, **data: Any):
        super().__init__(**data)
        self.id = generate_id(self.collection, swarm_id) if self.id is None else self.id

    async def create(self, session: AsyncSession | None = None) -> None:
        await db.create(collection_to_model[self.collection](**self.model_dump()), session)

    @classmethod
    async def read(cls: Type[T], id: str, session: AsyncSession | None = None) -> T:
        node_dict = await db.read(collection_to_model[cls.collection], id, session)
        return cls(**node_dict)

    @classmethod
    async def update(cls, id: str, data: Dict[str, Any], session: AsyncSession | None = None) -> None:
        await db.update(collection_to_model[cls.collection], id, data, session)

    @classmethod
    async def delete(cls, id: str, session: AsyncSession | None = None) -> None:
        await db.delete(collection_to_model[cls.collection], id, session)

    async def upsert(self, session: AsyncSession | None = None) -> None:
        await db.upsert(collection_to_model[self.collection](**self.model_dump()), session)

    @classmethod
    async def select(cls, id: str, columns: List[str], session: AsyncSession | None = None) -> Dict[str, Any]:
        return await db.select(collection_to_model[cls.collection], id, columns, session)

    @classmethod
    async def exists(cls, id: str, session: AsyncSession | None = None) -> bool:
        return await db.exists(collection_to_model[cls.collection], id, session)

    @classmethod
    async def batch_create(cls, models: List[T], session: AsyncSession | None = None) -> None:
        await db.batch_create([collection_to_model[cls.collection](**model.model_dump()) for model in models], session)

    @classmethod
    async def batch_update(cls, models: List[Dict[str, Any]], session: AsyncSession | None = None) -> None:
        await db.batch_update(collection_to_model[cls.collection], models, session)

    @classmethod
    async def batch_delete(cls, ids: List[str], session: AsyncSession | None = None) -> None:
        await db.batch_delete(collection_to_model[cls.collection], ids, session)

    @classmethod
    async def batch_copy(cls, old_ids: List[str], new_ids: List[str], session: AsyncSession | None = None) -> None:
        await db.batch_copy(collection_to_model[cls.collection], old_ids, new_ids, session)
