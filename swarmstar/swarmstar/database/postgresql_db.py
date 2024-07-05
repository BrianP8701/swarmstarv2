from sqlalchemy import create_engine, Table, MetaData, Column, String, select, insert, text, update, delete
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.orm import sessionmaker
from typing import Any, Callable, Dict
from swarmstar.swarmstar.database.abstract_db import AbstractDatabase

class PostgreSQLDatabase(AbstractDatabase):
    def __init__(self, connection_string: str):
        self.engine = create_engine(connection_string)
        self.metadata = MetaData()
        self.Session = sessionmaker(bind=self.engine)

    def dispose_instance(self) -> None:
        self.engine.dispose()

    def create(self, table_name: str, id: str, data: Dict[str, Any]) -> None:
        with self.Session() as session:
            table = Table(table_name, self.metadata, autoload_with=self.engine)
            stmt = insert(table).values(id=id, **data)
            session.execute(stmt)
            session.commit()

    def read(self, table_name: str, id: str) -> Dict[str, Any] | None:
        with self.Session() as session:
            table = Table(table_name, self.metadata, autoload_with=self.engine)
            stmt = select(table).where(table.c.id == id)
            result = session.execute(stmt).first()
            return dict(result) if result else None

    def update(self, table_name: str, id: str, data: Dict[str, Any]) -> None:
        with self.Session() as session:
            table = Table(table_name, self.metadata, autoload_with=self.engine)
            stmt = update(table).where(table.c.id == id).values(**data)
            session.execute(stmt)
            session.commit()

    def delete(self, table_name: str, id: str) -> None:
        with self.Session() as session:
            table = Table(table_name, self.metadata, autoload_with=self.engine)
            stmt = delete(table).where(table.c.id == id)
            session.execute(stmt)
            session.commit()

    def upsert(self, table_name: str, id: str, data: Dict[str, Any]) -> None:
        with self.Session() as session:
            table = Table(table_name, self.metadata, autoload_with=self.engine)
            stmt = pg_insert(table).values(id=id, **data).on_conflict_do_update(
                index_elements=['id'], set_=data)
            session.execute(stmt)
            session.commit()

    def exists(self, table_name: str, id: str) -> bool:
        with self.Session() as session:
            table = Table(table_name, self.metadata, autoload_with=self.engine)
            stmt = select([table.c.id]).where(table.c.id == id)
            result = session.execute(stmt).first()
            return result is not None

    def execute_raw_query(self, query: str) -> Any:
        with self.Session() as session:
            result = session.execute(text(query))
            return result.fetchall()

    def perform_transaction(self, operations: Callable) -> None:
        with self.Session() as session:
            with session.begin():
                operations(session)

    def clear_table(self, table_name: str) -> None:
        with self.Session() as session:
            table = Table(table_name, self.metadata, autoload_with=self.engine)
            stmt = delete(table)
            session.execute(stmt)
            session.commit()
