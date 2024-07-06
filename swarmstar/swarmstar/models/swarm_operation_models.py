from sqlalchemy import Column, String, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON

from swarmstar.swarmstar.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class BlockingOperationModel(BaseSQLAlchemyModel):
    __tablename__ = 'blocking_operations'
    id = Column(String, primary_key=True)
    node_id = Column(String)
    blocking_type = Column(String)
    args = Column(SQLiteJSON) # Dict[str, Any]
    context = Column(SQLiteJSON) # Dict[str, Any]
    next_function_to_call = Column(String)

class SpawnOperationModel(BaseSQLAlchemyModel):
    __tablename__ = 'spawn_operations'
    id = Column(String, primary_key=True)
    action_id = Column(String)
    goal = Column(SQLiteJSON) 
    context = Column(SQLiteJSON)
    parent_id = Column(String)
    node_id = Column(String)

class ActionOperationModel(BaseSQLAlchemyModel):
    __tablename__ = 'action_operations'
    id = Column(String, primary_key=True)
    function_to_call = Column(String)
    node_id = Column(String)
    args = Column(SQLiteJSON)

class TerminationOperationModel(BaseSQLAlchemyModel):
    __tablename__ = 'termination_operations'
    id = Column(String, primary_key=True)
    terminator_id = Column(String)
    node_id = Column(String)
    context = Column(SQLiteJSON)

class CommunicationOperationModel(BaseSQLAlchemyModel):
    __tablename__ = 'communication_operations'
    id = Column(String, primary_key=True)
    node_id = Column(String)
    message = Column(Text)
    context = Column(SQLiteJSON)
    next_function_to_call = Column(String)
