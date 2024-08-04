from abc import ABC
from sqlalchemy import Column, ForeignKey, String, Enum as SqlAlchemyEnum
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.ext.declarative import declared_attr

from swarmstar.enums.action_enum import ActionEnum
from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.enums.blocking_operation_enum import BlockingOperationEnum

class BaseOperationModel(BaseSQLAlchemyModel, ABC):
    __abstract__ = True

    @declared_attr
    def action_node_id(cls):
        return Column(String, ForeignKey('action_nodes.id'))

    @declared_attr
    def action_node(cls):
        return relationship("ActionNodeModel", back_populates="operations")


class SpawnOperationModel(BaseOperationModel):
    __tablename__ = 'spawn_operations'
    goal = Column(String)
    action_enum = Column(SqlAlchemyEnum(ActionEnum))
    context = Column(SQLiteJSON)

class FunctionCallOperationModel(BaseOperationModel):
    __tablename__ = 'function_call_operations'
    function_to_call = Column(String)

class TerminationOperationModel(BaseOperationModel):
    __tablename__ = 'termination_operations'
    terminator_id = Column(String)

class BlockingOperationModel(BaseOperationModel):
    __tablename__ = 'blocking_operations'
    next_function_to_call = Column(String)
    args = Column(SQLiteJSON)
    blocking_operation_enum = Column(SqlAlchemyEnum(BlockingOperationEnum))
