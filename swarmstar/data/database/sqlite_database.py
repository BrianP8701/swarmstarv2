import asyncio
import os
import threading
from typing import TYPE_CHECKING, Any, Callable, Dict, List, Optional

from dotenv import load_dotenv
from sqlalchemy import MetaData, Table, delete, text, update
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.future import select
from sqlalchemy.schema import Table

from data.constants import ALL_DATABASE_MODEL_CLASSES
from data.database.abstract_database import AbstractDatabase

if TYPE_CHECKING:
    from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel

load_dotenv()
SQLITE_DB_FILE_PATH = os.getenv("SQLITE_DB_FILE_PATH")

if SQLITE_DB_FILE_PATH is None:
    raise ValueError("SQLITE_DB_FILE_PATH is not set in the .env file")


class SqliteDatabase(AbstractDatabase):
    _instance = None
    _lock = threading.Lock()

    """ Initialization and configuration """

    # Singleton pattern
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(SqliteDatabase, cls).__new__(cls)
                    cls._instance._initialize_database()
        return cls._instance

    def _initialize_database(self):
        connection_string = f"sqlite+aiosqlite:///{SQLITE_DB_FILE_PATH}"
        self.engine = create_async_engine(connection_string)
        self.metadata = MetaData()
        self.Session = async_sessionmaker(bind=self.engine, class_=AsyncSession)
        asyncio.run(self.create_all_tables())

    async def create_all_tables(self):
        async with self.engine.begin() as conn:
            for model in ALL_DATABASE_MODEL_CLASSES:
                await conn.run_sync(model.metadata.create_all)

    async def delete_all_tables(self):
        async with self.engine.begin() as conn:
            for model in ALL_DATABASE_MODEL_CLASSES:
                await conn.run_sync(model.metadata.drop_all)

    async def dispose_instance(self) -> None:
        await self.engine.dispose()

    """ CRUD operations """

    async def create(
        self, model: Table, session: Optional[AsyncSession] = None
    ) -> None:
        if not session:
            session = self.Session()
        async with session:
            print(f"Adding model to session: {model}")
            session.add(model)
            await session.commit()
            print("Model added and committed")

    async def read(
        self,
        model_class: "BaseSQLAlchemyModel",
        id: str,
        session: Optional[AsyncSession] = None,
    ) -> "BaseSQLAlchemyModel":
        if not session:
            session = self.Session()
        async with session:
            result = await session.get(model_class, id)
            if result:
                return result
            else:
                raise ValueError(f"No {model_class.__name__} with id {id} found")

    async def update(
        self,
        model_class: "BaseSQLAlchemyModel",
        id: str,
        data: Dict[str, Any],
        session: Optional[AsyncSession] = None,
    ) -> None:
        if not session:
            session = self.Session()
        async with session:
            instance = await session.get(model_class, id)
            if instance:
                for key, value in data.items():
                    setattr(instance, key, value)
                await session.commit()

    async def delete(
        self,
        model_class: "BaseSQLAlchemyModel",
        id: str,
        session: Optional[AsyncSession] = None,
    ) -> None:
        if not session:
            session = self.Session()
        async with session:
            instance = await session.get(model_class, id)
            if instance:
                await session.delete(instance)
                await session.commit()

    """ Other Common Operations """

    async def upsert(
        self, model: Table, session: Optional[AsyncSession] = None
    ) -> None:
        if not session:
            session = self.Session()
        async with session:
            stmt = sqlite_insert(model).values(**model.__dict__)
            stmt = stmt.on_conflict_do_update(
                index_elements=["id"], set_={**model.__dict__}
            )
            await session.execute(stmt)
            await session.commit()

    async def select(
        self,
        model_class: "BaseSQLAlchemyModel",
        id: str,
        columns: List[str],
        session: Optional[AsyncSession] = None,
    ) -> Dict[str, Any]:
        if not session:
            session = self.Session()
        async with session:
            query = select(
                *[getattr(model_class, column) for column in columns]
            ).filter_by(id=id)
            result = await session.execute(query)
            result = result.scalars().first()
            if result:
                return {column: getattr(result, column) for column in columns}
            else:
                raise ValueError(f"No {model_class.__name__} with id {id} found")

    async def exists(
        self,
        model_class: "BaseSQLAlchemyModel",
        id: str,
        session: Optional[AsyncSession] = None,
    ) -> bool:
        if not session:
            session = self.Session()
        async with session:
            result = await session.get(model_class, id)
            return result is not None

    async def execute_raw_query(
        self, query: str, session: Optional[AsyncSession] = None
    ) -> Any:
        if not session:
            session = self.Session()
        async with session:
            result = await session.execute(text(query))
            return result.fetchall()

    async def perform_transaction(self, operations: Callable) -> None:
        async with self.Session() as session:
            async with session.begin():
                await operations(session)

    """ Utility Methods """

    def get_session(self) -> AsyncSession:
        return self.Session()

    async def clear_table(
        self, model_class: "BaseSQLAlchemyModel", safety: str
    ) -> None:
        if safety != "CONFIRM":
            raise ValueError("Safety string does not match. Operation aborted.")
        async with self.Session() as session:
            await session.execute(delete(model_class))
            await session.commit()

    """ Batch operations """

    async def batch_create(
        self, models: List[Table], session: Optional[AsyncSession] = None
    ) -> None:
        if not session:
            session = self.Session()
        async with session:
            session.add_all(models)
            await session.commit()

    async def batch_read(
        self,
        model_class: "BaseSQLAlchemyModel",
        ids: List[str],
        session: Optional[AsyncSession] = None,
    ) -> List["BaseSQLAlchemyModel"]:
        if not session:
            session = self.Session()
        async with session:
            query = select(model_class).where(getattr(model_class, "id").in_(ids))
            result = await session.execute(query)
            return list(result.scalars().all())

    async def batch_update(
        self,
        model_class: "BaseSQLAlchemyModel",
        data_list: List[Dict[str, Any]],
        session: Optional[AsyncSession] = None,
    ) -> None:
        if not session:
            session = self.Session()
        async with session:
            for data in data_list:
                stmt = (
                    update(model_class)
                    .where(getattr(model_class, "id") == data["id"])
                    .values(**{k: v for k, v in data.items() if k != "id"})
                )
                await session.execute(stmt)
            await session.commit()

    async def batch_delete(
        self,
        model_class: "BaseSQLAlchemyModel",
        ids: List[str],
        session: Optional[AsyncSession] = None,
    ) -> None:
        if not session:
            session = self.Session()
        async with session:
            await session.execute(
                delete(model_class).where(getattr(model_class, "id").in_(ids))
            )
            await session.commit()

    async def batch_copy(
        self,
        model_class: "BaseSQLAlchemyModel",
        old_ids: List[str],
        new_ids: List[str],
        session: Optional[AsyncSession] = None,
    ) -> None:
        if len(old_ids) != len(new_ids):
            raise ValueError("The length of old_ids and new_ids must be the same.")

        if not session:
            session = self.Session()
        async with session:
            instances = await self.batch_read(model_class, old_ids, session)
            new_instances = []
            for instance, new_id in zip(instances, new_ids):
                new_instance = model_class(**{**instance.__dict__, "id": new_id})
                new_instances.append(new_instance)
            session.add_all(new_instances)
            await session.commit()
