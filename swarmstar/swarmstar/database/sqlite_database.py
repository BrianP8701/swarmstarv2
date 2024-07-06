from typing import Dict
from sqlalchemy import MetaData, Table, delete, text, update
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.asyncio import async_sessionmaker
from sqlalchemy.future import select
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from typing import Any, Callable, List
from sqlalchemy.ext.declarative import declarative_base
import threading

from swarmstar.swarmstar.database.abstract_database import AbstractDatabase

Base = declarative_base()

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
        connection_string = "sqlite+aiosqlite:///swarmstar.sqlite"
        self.engine = create_async_engine(connection_string)
        self.metadata = MetaData()
        self.Session = async_sessionmaker(bind=self.engine, class_=AsyncSession)
        self.create_all_tables()

    def create_all_tables(self):
        from swarmstar.swarmstar.constants import all_models
        for model in all_models:
            model.metadata.create_all(bind=self.engine)

    async def dispose_instance(self) -> None:
        await self.engine.dispose()

    """ CRUD operations """

    async def create(self, model, session: AsyncSession | None = None) -> None:
        if not session:
            session = self.Session()
        async with session:
            session.add(model)
            await session.commit()

    async def read(self, model_class, id: str, session: AsyncSession | None = None) -> Dict[str, Any]: 
        if not session:
            session = self.Session()
        async with session:
            result = await session.get(model_class, id)
            if result:
                return {column.name: getattr(result, column.name) for column in result.__table__.columns}
            else:
                raise ValueError(f"No {model_class.__name__} with id {id} found")

    async def update(self, model_class, id: str, data: Dict[str, Any], session: AsyncSession | None = None) -> None:
        if not session:
            session = self.Session()
        async with session:
            instance = await session.get(model_class, id)
            if instance:
                for key, value in data.items():
                    setattr(instance, key, value)
                await session.commit()

    async def delete(self, model_class, id: str, session: AsyncSession | None = None) -> None:
        if not session:
            session = self.Session()
        async with session:
            instance = await session.get(model_class, id)
            if instance:
                await session.delete(instance)
                await session.commit()

    """ Other Common Operations """

    async def upsert(self, model, session: AsyncSession | None = None) -> None:
        if not session:
            session = self.Session()
        async with session:
            stmt = sqlite_insert(model.__table__).values(**model.__dict__)
            stmt = stmt.on_conflict_do_update(
                index_elements=['id'], set_={**model.__dict__})
            await session.execute(stmt)
            await session.commit()

    async def select(self, model_class, id: str, columns: List[str], session: AsyncSession | None = None) -> Dict[str, Any]:
        if not session:
            session = self.Session()
        async with session:
            query = select(*[getattr(model_class, column) for column in columns]).filter_by(id=id)
            result = await session.execute(query)
            result = result.scalars().first()
            if result:
                return {column: getattr(result, column) for column in columns}
            else:
                raise ValueError(f"No {model_class.__name__} with id {id} found")

    async def exists(self, model_class, id: str, session: AsyncSession | None = None) -> bool:
        if not session:
            session = self.Session()
        async with session:
            result = await session.get(model_class, id)
            return result is not None

    async def execute_raw_query(self, query: str, session: AsyncSession | None = None) -> Any:
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

    async def get_session(self) -> AsyncSession:
        return self.Session()

    async def clear_table(self, model_class, safety: str) -> None:
        if safety != "CONFIRM":
            raise ValueError("Safety string does not match. Operation aborted.")
        async with self.Session() as session:
            await session.execute(delete(model_class))
            await session.commit()

    """ Batch operations """

    async def batch_delete(self, model_class, ids: List[str], session: AsyncSession | None = None) -> None:
        if not session:
            session = self.Session()
        async with session:
            await session.execute(delete(model_class).where(model_class.id.in_(ids)))
            await session.commit()

    async def batch_update(self, model_class, data_list: List[Dict[str, Any]], session: AsyncSession | None = None) -> None:
        if not session:
            session = self.Session()
        async with session:
            for data in data_list:
                stmt = update(model_class).where(model_class.id == data['id']).values(**{k: v for k, v in data.items() if k != 'id'})
                await session.execute(stmt)
            await session.commit()

    async def batch_create(self, models: List[Any], session: AsyncSession | None = None) -> None:
        if not session:
            session = self.Session()
        async with session:
            session.add_all(models)
            await session.commit()

    async def batch_copy(self, model_class, old_ids: List[str], new_ids: List[str], session: AsyncSession | None = None) -> None:
        if len(old_ids) != len(new_ids):
            raise ValueError("The length of old_ids and new_ids must be the same.")
        
        if not session:
            session = self.Session()
        async with session:
            new_instances = []
            for old_id, new_id in zip(old_ids, new_ids):
                instance = await session.get(model_class, old_id)
                if instance:
                    new_instance = model_class(**{**instance.__dict__, 'id': new_id})
                    new_instances.append(new_instance)
            session.add_all(new_instances)
            await session.commit()
