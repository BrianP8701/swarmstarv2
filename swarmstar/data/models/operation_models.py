from sqlalchemy import Column
from sqlalchemy import Enum as SqlAlchemyEnum
from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.blocking_operation_enum import BlockingOperationEnum


class SpawnOperationModel(BaseSQLAlchemyModel):
    __tablename__ = "spawn_operations"
    goal = Column(String)
    action_enum = Column(SqlAlchemyEnum(ActionEnum))
    context = Column(SQLiteJSON)
    action_node_id = Column(String, ForeignKey("action_nodes.id"))
    action_node = relationship("ActionNodeModel", back_populates="spawn_operations")


class FunctionCallOperationModel(BaseSQLAlchemyModel):
    __tablename__ = "function_call_operations"
    function_to_call = Column(String)
    action_node_id = Column(String, ForeignKey("action_nodes.id"))
    action_node = relationship(
        "ActionNodeModel", back_populates="function_call_operations"
    )


class TerminationOperationModel(BaseSQLAlchemyModel):
    __tablename__ = "termination_operations"
    terminator_id = Column(String)
    action_node_id = Column(String, ForeignKey("action_nodes.id"))
    action_node = relationship(
        "ActionNodeModel", back_populates="termination_operations"
    )


class BlockingOperationModel(BaseSQLAlchemyModel):
    __tablename__ = "blocking_operations"
    next_function_to_call = Column(String)
    args = Column(SQLiteJSON)
    blocking_operation_enum = Column(SqlAlchemyEnum(BlockingOperationEnum))
    action_node_id = Column(String, ForeignKey("action_nodes.id"))
    action_node = relationship("ActionNodeModel", back_populates="blocking_operations")
