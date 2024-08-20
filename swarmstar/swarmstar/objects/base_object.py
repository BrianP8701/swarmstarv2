import asyncio
from abc import ABC
from typing import Any, ClassVar, Dict, Generic, List, Optional, Type, TypeVar

from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.ext.asyncio import AsyncSession

from data.constants import DATABASE_MAP
from data.database import Database
from data.enums import DatabaseTableEnum

db = Database()

T = TypeVar("T", bound="BaseObject")


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
    swarm_id: Optional[str] = None
    id: str = ""

    model_config = ConfigDict(use_enum_values=True)

    @property
    def model_class(self):
        return DATABASE_MAP[self.table_enum]["model_class"]

    def __init__(self, **data: Any):
        print("BaseObject __init__ called")
        super().__init__(**data)
        print(f"BaseObject __init__ called with data: {data}")
        print("id", self.id)
        if self.id == "":
            print("No ID provided, generating ID")
            from swarmstar.utils.misc.ids import generate_id

            try:
                loop = asyncio.get_event_loop()
            except RuntimeError:
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
            self.id = loop.run_until_complete(
                generate_id(db, self.table_enum, self.swarm_id)
            )
            print(f"Generated ID: {self.id}")
            loop.run_until_complete(self._create())

    def _filter_model_fields(self) -> Dict[str, Any]:
        """
        Filters out fields that are not part of the database model.
        """
        model_fields = {col.name for col in self.model_class.__table__.columns}
        return {
            key: value
            for key, value in self.model_dump().items()
            if key in model_fields
        }

    async def _create(self, session: Optional[AsyncSession] = None) -> None:
        """
        This method should never be called directly, except in cases where the object is created with a predefined id.
        It is called by the __init__ function when the object is created without an id.
        """
        print(f"Creating entry in database for: {self}")
        await db.create(self.model_class(**self._filter_model_fields()), session)
        print("Entry created successfully")

    @classmethod
    async def read(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> T:
        model = await db.read(cls().model_class, id, session)
        return cls(**model.__dict__)

    @classmethod
    async def delete(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> None:
        await db.delete(cls().model_class, id, session)

    async def upsert(self, session: Optional[AsyncSession] = None) -> None:
        await db.upsert(self.model_class(**self._filter_model_fields()), session)

    @classmethod
    async def select(cls: Type[T], id: str, columns: List[str], session: Optional[AsyncSession] = None) -> Dict[str, Any]:
        return await db.select(cls().model_class, id, columns, session)

    @classmethod
    async def exists(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> bool:
        return await db.exists(cls().model_class, id, session)

    @classmethod
    async def batch_create(cls: Type[T], models: List[T], session: Optional[AsyncSession] = None) -> None:
        await db.batch_create([cls().model_class(**model.model_dump()) for model in models], session)

    @classmethod
    async def batch_read(cls: Type[T], ids: List[str], session: Optional[AsyncSession] = None) -> List[T]:
        models = await db.batch_read(cls().model_class, ids, session)
        return [cls(**model.__dict__) for model in models]

    @classmethod
    async def batch_update(cls: Type[T], models: List[Dict[str, Any]], session: Optional[AsyncSession] = None) -> None:
        await db.batch_update(cls().model_class, models, session)

    @classmethod
    async def batch_delete(cls: Type[T], ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_delete(cls().model_class, ids, session)

    @classmethod
    async def batch_copy(cls: Type[T], old_ids: List[str], new_ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_copy(cls().model_class, old_ids, new_ids, session)
