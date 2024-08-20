from sqlalchemy import Column
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from data.models.message_model import MessageModel
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.action_status_enum import ActionStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum


class ActionNodeModel(BaseSQLAlchemyModel):
    __tablename__ = "action_nodes"

    id = Column(String, primary_key=True)

    goal = Column(Text, nullable=False)
    status = Column(SQLAlchemyEnum(ActionStatusEnum), default=ActionStatusEnum.ACTIVE)
    termination_policy_enum = Column(
        SQLAlchemyEnum(TerminationPolicyEnum), default=TerminationPolicyEnum.SIMPLE
    )
    report = Column(Text, nullable=True)
    context_history = Column(SQLiteJSON, default=lambda: [])
    action_enum = Column(SQLAlchemyEnum(ActionEnum), nullable=False)
    parent_id = Column(String, ForeignKey("action_nodes.id"), nullable=True)

    children = relationship("ActionNodeModel", backref="parent", remote_side=[id])

    spawn_operations = relationship(
        "SpawnOperationModel",
        back_populates="action_node",
        cascade="all, delete-orphan",
    )
    function_call_operations = relationship(
        "FunctionCallOperationModel",
        back_populates="action_node",
        cascade="all, delete-orphan",
    )
    termination_operations = relationship(
        "TerminationOperationModel",
        back_populates="action_node",
        cascade="all, delete-orphan",
    )
    blocking_operations = relationship(
        "BlockingOperationModel",
        back_populates="action_node",
        cascade="all, delete-orphan",
    )

    messages = relationship(
        MessageModel,
        backref="action_node",
        cascade="all, delete-orphan",
        primaryjoin="MessageModel.action_node_id == ActionNodeModel.id",
    )
