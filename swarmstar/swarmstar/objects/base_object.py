from abc import ABC
import asyncio
from typing import Any, Dict, List, Optional, Type, TypeVar, ClassVar, Generic
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.ext.asyncio import AsyncSession

from swarmstar.enums.database_table_enum import DatabaseTableEnum
from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from data.database import Database

db = Database()

T = TypeVar('T', bound='BaseObject')

class BaseObject(BaseModel, Generic[T], ABC):
    """
    This is the base class for all objects in Swarmstar that are associated with a database table.

    It enforces class variables for the database table they are stored in,
    and the SQLAlchemy model they are stored in.

    Then it provides all the simple database methods.

    An important function to take a look at is `generate_id` in the __init__ function.
    This project has an id schema, the ids aren't entirely random.
    The id schema makes a lot of operations very simple.
    """
    table_enum: ClassVar[DatabaseTableEnum] = Field(exclude=True)
    database_model_class: ClassVar[BaseSQLAlchemyModel] = Field(exclude=True)
    id: str = ''

    model_config = ConfigDict(use_enum_values=True)

    def __init__(self, swarm_id: Optional[str] = None, **data: Any):
        super().__init__(**data)
        if not self.id:
            from swarmstar.utils.misc.ids import generate_id
            loop = asyncio.get_event_loop()
            self.id = loop.run_until_complete(generate_id(db, self.table_enum, swarm_id))
            loop.run_until_complete(self._create())

    def _filter_model_fields(self) -> Dict[str, Any]:
        """
        Filters out fields that are not part of the database model.
        """
        model_fields = {col.name for col in self.database_model_class.__table__.columns}
        return {key: value for key, value in self.model_dump().items() if key in model_fields}

    async def _create(self, session: Optional[AsyncSession] = None) -> None:
        """
        This method should never be called directly, except in cases where the object is created with a predefined id.
        It is called by the __init__ function when the object is created without an id.
        """
        await db.create(self.database_model_class(**self._filter_model_fields()), session)

    @classmethod
    async def read(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> T:
        model = await db.read(cls.database_model_class, id, session)
        return cls(**model.__dict__)

    @classmethod
    async def delete(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> None:
        await db.delete(cls.database_model_class, id, session)

    async def upsert(self, session: Optional[AsyncSession] = None) -> None:
        await db.upsert(self.database_model_class(**self._filter_model_fields()), session)

    @classmethod
    async def select(cls: Type[T], id: str, columns: List[str], session: Optional[AsyncSession] = None) -> Dict[str, Any]:
        return await db.select(cls.database_model_class, id, columns, session)

    @classmethod
    async def exists(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> bool:
        return await db.exists(cls.database_model_class, id, session)

    @classmethod
    async def batch_create(cls: Type[T], models: List[T], session: Optional[AsyncSession] = None) -> None:
        await db.batch_create([cls.database_model_class(**model.model_dump()) for model in models], session)

    @classmethod
    async def batch_read(cls: Type[T], ids: List[str], session: Optional[AsyncSession] = None) -> List[T]:
        models = await db.batch_read(cls.database_model_class, ids, session)
        return [cls(**model.__dict__) for model in models]

    @classmethod
    async def batch_update(cls: Type[T], models: List[Dict[str, Any]], session: Optional[AsyncSession] = None) -> None:
        await db.batch_update(cls.database_model_class, models, session)

    @classmethod
    async def batch_delete(cls: Type[T], ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_delete(cls.database_model_class, ids, session)

    @classmethod
    async def batch_copy(cls: Type[T], old_ids: List[str], new_ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_copy(cls.database_model_class, old_ids, new_ids, session)