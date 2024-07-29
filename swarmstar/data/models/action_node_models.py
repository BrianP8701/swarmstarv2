from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from sqlalchemy import ARRAY, Column, ForeignKey, String, Enum as SqlAlchemyEnum
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.action_status_enum import ActionStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum


class BaseActionNodeModel(BaseSQLAlchemyModel):
    __tablename__ = "action_nodes"
    id = Column(String, primary_key=True)
    action_enum = Column(SqlAlchemyEnum(ActionEnum))
    goal = Column(String)
    status = Column(SqlAlchemyEnum(ActionStatusEnum), default=ActionStatusEnum.ACTIVE)
    parent_id = Column(String, ForeignKey('action_metadata_nodes.id'), nullable=True)
    children_ids = Column(ARRAY(String), default=lambda: [])
    title = Column(String, nullable=False)
    parent_id = Column(String, ForeignKey('swarm_nodes.id'), nullable=True)
    termination_policy = Column(SqlAlchemyEnum(TerminationPolicyEnum), default=TerminationPolicyEnum.SIMPLE)
    message_ids = Column(SQLiteJSON, default=lambda: [])
    report = Column(String, nullable=True)
    context = Column(SQLiteJSON, default=lambda: {})

    children = relationship("ActionNodeModel", backref='parent', remote_side=[id])
    operations = relationship("BaseOperationModel", backref='action_node', cascade="all, delete-orphan")
