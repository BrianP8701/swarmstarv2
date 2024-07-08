from sqlalchemy import Column, String, JSON, Enum as SQLAlchemyEnum

from swarmstar.enums.database_table import DatabaseTable
from swarmstar.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class SwarmstarEventModel(BaseSQLAlchemyModel):
    __tablename__ = 'swarmstar_events'
    id = Column(String, primary_key=True)
    operation = Column(String)  # e.g., 'update', 'delete', etc.
    data = Column(JSON)  # Store the state of the model after the operation
    model_name = Column(SQLAlchemyEnum(DatabaseTable), nullable=False)  # Name of the model being changed
