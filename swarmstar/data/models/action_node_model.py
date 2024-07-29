from sqlalchemy import Column, ForeignKey, String, Enum as SQLAlchemyEnum, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.action_status_enum import ActionStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class ActionNodeModel(BaseSQLAlchemyModel):
    __tablename__ = 'action_nodes'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    parent_id = Column(String, ForeignKey('action_nodes.id'), nullable=True)
    children_ids = Column(SQLiteJSON, default=lambda: [])
    action_type = Column(SQLAlchemyEnum(ActionEnum), nullable=False)
    goal = Column(Text, nullable=False)
    status = Column(SQLAlchemyEnum(ActionStatusEnum), default=ActionStatusEnum.ACTIVE)
    termination_policy = Column(SQLAlchemyEnum(TerminationPolicyEnum), default=TerminationPolicyEnum.SIMPLE)
    message_ids = Column(SQLiteJSON, default=lambda: [])
    report = Column(Text, nullable=True)
    context = Column(SQLiteJSON, default=lambda: {})

    children = relationship("ActionNodeModel", backref='parent', remote_side=[id])
    operations = relationship("BaseOperationModel", backref='action_node', cascade="all, delete-orphan")
