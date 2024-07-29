from abc import ABC
import asyncio
from typing import Any, Dict, List, Optional, Type, TypeVar, ClassVar, Generic, cast
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.ext.asyncio import AsyncSession

from swarmstar.enums.database_table_enum import DatabaseTableEnum
from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.utils.misc.ids import generate_id
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
    __table_enum__: ClassVar[DatabaseTableEnum] = Field(exclude=True)
    __model_class__: ClassVar[BaseSQLAlchemyModel] = Field(exclude=True)
    id: str = ''

    model_config = ConfigDict(use_enum_values=True)

    def __init__(self, swarm_id: Optional[str] = None, **data: Any):
        super().__init__(**data)
        if not self.id:
            loop = asyncio.get_event_loop()
            self.id = loop.run_until_complete(generate_id(self.__table_enum__, swarm_id))
            loop.run_until_complete(self._create())

    async def _create(self, session: Optional[AsyncSession] = None) -> None:
        """
        This method should never be called directly.
        It is called by the __init__ function when the object is created without an id.
        """
        await db.create(self.__model_class__(**self.model_dump()), session)

    @classmethod
    async def read(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> T:
        model = await db.read(cls.__model_class__, id, session)
        return cast(T, cls(**model.__dict__))

    @classmethod
    async def delete(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> None:
        await db.delete(cls.__model_class__, id, session)

    async def upsert(self, session: Optional[AsyncSession] = None) -> None:
        await db.upsert(self.__model_class__(**self.model_dump()), session)

    @classmethod
    async def select(cls: Type[T], id: str, columns: List[str], session: Optional[AsyncSession] = None) -> Dict[str, Any]:
        return await db.select(cls.__model_class__, id, columns, session)

    @classmethod
    async def exists(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> bool:
        return await db.exists(cls.__model_class__, id, session)

    @classmethod
    async def batch_create(cls: Type[T], models: List[T], session: Optional[AsyncSession] = None) -> None:
        await db.batch_create([cls.__model_class__(**model.model_dump()) for model in models], session)

    @classmethod
    async def batch_read(cls: Type[T], ids: List[str], session: Optional[AsyncSession] = None) -> List[T]:
        models = await db.batch_read(cls.__model_class__, ids, session)
        return [cls(**model.__dict__) for model in models]

    @classmethod
    async def batch_update(cls: Type[T], models: List[Dict[str, Any]], session: Optional[AsyncSession] = None) -> None:
        await db.batch_update(cls.__model_class__, models, session)

    @classmethod
    async def batch_delete(cls: Type[T], ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_delete(cls.__model_class__, ids, session)

    @classmethod
    async def batch_copy(cls: Type[T], old_ids: List[str], new_ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_copy(cls.__model_class__, old_ids, new_ids, session)
