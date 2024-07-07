import asyncio
from typing import Any, Dict, List, Optional, Type, TypeVar, ClassVar, Generic
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy.ext.asyncio import AsyncSession

from swarmstar.swarmstar.enums.database_table import DatabaseTable
from swarmstar.swarmstar.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.swarmstar.utils.misc.ids import generate_id
from swarmstar.database import Database

db = Database()

T = TypeVar('T', bound='BaseObject')

class BaseObject(BaseModel, Generic[T]):
    __table__: ClassVar[DatabaseTable] = Field(exclude=True)
    __object_model__: ClassVar[BaseSQLAlchemyModel] = Field(exclude=True)
    id: str = ''

    model_config = ConfigDict(use_enum_values=True)

    def __init__(self, swarm_id: Optional[str] = None, **data: Any):
        super().__init__(**data)
        if not self.id:
            self.id = asyncio.run(generate_id(self.__table__, swarm_id))

    async def create(self, session: Optional[AsyncSession] = None) -> None:
        await db.create(self.__object_model__(**self.model_dump()), session)

    @classmethod
    async def read(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> T:
        model = await db.read(cls.__object_model__, id, session)
        return cls(**model.__dict__)

    @classmethod
    async def update(cls: Type[T], id: str, data: Dict[str, Any], session: Optional[AsyncSession] = None) -> None:
        await db.update(cls.__object_model__, id, data, session)

    @classmethod
    async def delete(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> None:
        await db.delete(cls.__object_model__, id, session)

    async def upsert(self, session: Optional[AsyncSession] = None) -> None:
        await db.upsert(self.__object_model__(**self.model_dump()), session)

    @classmethod
    async def select(cls: Type[T], id: str, columns: List[str], session: Optional[AsyncSession] = None) -> Dict[str, Any]:
        return await db.select(cls.__object_model__, id, columns, session)

    @classmethod
    async def exists(cls: Type[T], id: str, session: Optional[AsyncSession] = None) -> bool:
        return await db.exists(cls.__object_model__, id, session)

    @classmethod
    async def batch_create(cls: Type[T], models: List[T], session: Optional[AsyncSession] = None) -> None:
        await db.batch_create([cls.__object_model__(**model.model_dump()) for model in models], session)

    @classmethod
    async def batch_read(cls: Type[T], ids: List[str], session: Optional[AsyncSession] = None) -> List[T]:
        models = await db.batch_read(cls.__object_model__, ids, session)
        return [cls(**model.__dict__) for model in models]

    @classmethod
    async def batch_update(cls: Type[T], models: List[Dict[str, Any]], session: Optional[AsyncSession] = None) -> None:
        await db.batch_update(cls.__object_model__, models, session)

    @classmethod
    async def batch_delete(cls: Type[T], ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_delete(cls.__object_model__, ids, session)

    @classmethod
    async def batch_copy(cls: Type[T], old_ids: List[str], new_ids: List[str], session: Optional[AsyncSession] = None) -> None:
        await db.batch_copy(cls.__object_model__, old_ids, new_ids, session)
