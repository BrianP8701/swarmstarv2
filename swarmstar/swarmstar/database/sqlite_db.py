from typing import Dict, Union
from sqlalchemy import create_engine, Table, MetaData, select, insert, text, update, delete
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.sqlite import insert as sqlite_insert
from typing import Any, Callable, List, Optional, Type
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.declarative import as_declarative, declared_attr

from swarmstar.database.abstract_db import AbstractDatabase

Base = declarative_base()

class SqliteDatabase(AbstractDatabase):
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SqliteDatabase, cls).__new__(cls)
            cls._instance._initialize_database()
        return cls._instance

    def _initialize_database(self):
        connection_string = "sqlite:///swarmstar.sqlite"
        self.engine = create_engine(connection_string)
        self.metadata = MetaData()
        self.Session = sessionmaker(bind=self.engine)
        self.validate_tables(["nodes", "edges", "graphs"])
        
    def validate_tables(self, tables: List[str]):
        for table_name in tables:
            if not self.engine.dialect.has_table(self.engine.connect(), table_name):
                table = Table(table_name, self.metadata, autoload_with=self.engine)
                table.create(self.engine)

    def dispose_instance(self) -> None:
        self.engine.dispose()

    def create(self, model) -> None:
        with self.Session() as session:
            session.add(model)
            session.commit()

    def read(self, model_class, id: str) -> Dict[str, Any]: 
        with self.Session() as session:
            result = session.query(model_class).filter_by(id=id).first()
            if result:
                return {column.name: getattr(result, column.name) for column in result.__table__.columns}
            else:
                raise ValueError(f"No {model_class.__name__} with id {id} found")

    def delete(self, model_class, id: str) -> None:
        with self.Session() as session:
            instance = session.query(model_class).filter_by(id=id).first()
            if instance:
                session.delete(instance)
                session.commit()

    def upsert(self, model) -> None:
        with self.Session() as session:
            stmt = sqlite_insert(model.__table__).values(**model.__dict__)
            stmt = stmt.on_conflict_do_update(
                index_elements=['id'], set_={**model.__dict__})
            session.execute(stmt)
            session.commit()

    def update(self, model_class, id: str, data: Dict[str, Any]) -> None:
        with self.Session() as session:
            instance = session.query(model_class).filter_by(id=id).first()
            if instance:
                for key, value in data.items():
                    setattr(instance, key, value)
                session.commit()

    def exists(self, model_class, id: str) -> bool:
        with self.Session() as session:
            result = session.query(model_class).filter_by(id=id).first()
            return result is not None

    def execute_raw_query(self, query: str) -> Any:
        with self.Session() as session:
            result = session.execute(text(query))
            return result.fetchall()

    def perform_transaction(self, operations: Callable) -> None:
        with self.Session() as session:
            with session.begin():
                operations(session)

    def clear_table(self, model_class, safety: str) -> None:
        if safety != "CONFIRM":
            raise ValueError("Safety string does not match. Operation aborted.")
        with self.Session() as session:
            session.query(model_class).delete()
            session.commit()

    def batch_delete(self, model_class, ids: List[str]) -> None:
        with self.Session() as session:
            session.query(model_class).filter(model_class.id.in_(ids)).delete(synchronize_session=False)
            session.commit()

    def batch_update(self, model_class, data_list: List[Dict[str, Any]]) -> None:
        with self.Session() as session:
            for data in data_list:
                stmt = update(model_class).where(model_class.id == data['id']).values(**{k: v for k, v in data.items() if k != 'id'})
                session.execute(stmt)
            session.commit()

    def batch_create(self, models: List[Any]) -> None:
        with self.Session() as session:
            session.bulk_save_objects(models)
            session.commit()

    def batch_copy(self, model_class, old_ids: List[str], new_ids: List[str]) -> None:
        if len(old_ids) != len(new_ids):
            raise ValueError("The length of old_ids and new_ids must be the same.")
        
        with self.Session() as session:
            new_instances = []
            for old_id, new_id in zip(old_ids, new_ids):
                instance = session.query(model_class).filter_by(id=old_id).first()
                if instance:
                    new_instance = model_class(**{**instance.__dict__, 'id': new_id})
                    new_instances.append(new_instance)
            session.bulk_save_objects(new_instances)
            session.commit()

