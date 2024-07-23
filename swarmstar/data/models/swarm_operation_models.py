from sqlalchemy import Column, ForeignKey, String, Enum as SqlAlchemyEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from swarmstar.enums.action_enum import ActionEnum

from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.enums.blocking_operation_enum import BlockingOperationEnum

class BaseOperationModel(BaseSQLAlchemyModel):
    __tablename__ = 'operations'
    id = Column(String, primary_key=True)
    action_node_id = Column(String, ForeignKey('action_nodes.id'))
    action_node = relationship("ActionNodeModel", back_populates="operations") 
    context = Column(SQLiteJSON, default=lambda: {})
    __mapper_args__ = {
        'polymorphic_identity': 'operation',
        'polymorphic_on': type
    }

class SpawnOperationModel(BaseOperationModel):
    __tablename__ = 'spawn_operations'
    id = Column(String, ForeignKey('operations.id'), primary_key=True)
    goal = Column(String)
    action_enum = Column(SqlAlchemyEnum(ActionEnum))
    __mapper_args__ = {
        'polymorphic_identity': 'spawn_operation',
    }

class FunctionCallOperationModel(BaseOperationModel):
    __tablename__ = 'function_call_operations'
    id = Column(String, ForeignKey('operations.id'), primary_key=True)
    function_to_call = Column(String)
    __mapper_args__ = {
        'polymorphic_identity': 'function_call_operation',
    }

class TerminationOperationModel(BaseOperationModel):
    __tablename__ = 'termination_operations'
    id = Column(String, ForeignKey('operations.id'), primary_key=True)
    terminator_id = Column(String)
    __mapper_args__ = {
        'polymorphic_identity': 'termination_operation',
    }

class BlockingOperationModel(BaseOperationModel):
    __tablename__ = 'blocking_operations'
    id = Column(String, ForeignKey('operations.id'), primary_key=True)
    __mapper_args__ = {
        'polymorphic_identity': 'blocking_operation',
    }
    next_function_to_call = Column(String)
    blocking_operation_enum = Column(SqlAlchemyEnum(BlockingOperationEnum))
    args = Column(SQLiteJSON, default=lambda: {})
