from sqlalchemy import Column, String, Integer, JSON, Enum as SQLAlchemyEnum
from sqlalchemy.ext.declarative import declarative_base
from contextlib import contextmanager

from swarmstar.swarmstar.enums.database_collection import DatabaseCollection
from swarmstar.swarmstar.utils.misc.ids import generate_id

Base = declarative_base()

class SwarmstarEventModel(Base):
    __tablename__ = 'swarmstar_events'
    id = Column(Integer, primary_key=True)
    swarmstar_space_id = Column(String)
    operation = Column(String)  # e.g., 'update', 'delete', etc.
    data = Column(JSON)  # Store the state of the model after the operation
    model_name = Column(SQLAlchemyEnum(DatabaseCollection), nullable=False)  # Name of the model being changed
