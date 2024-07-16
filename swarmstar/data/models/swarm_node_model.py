from sqlalchemy import Column, ForeignKey, String, Boolean, Enum as SQLAlchemyEnum, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.swarm_node_status_enum import SwarmNodeStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class SwarmNodeModel(BaseSQLAlchemyModel):
    __tablename__ = 'swarm_nodes'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    parent_id = Column(String, ForeignKey('swarm_nodes.id'), nullable=True)
    children_ids = Column(SQLiteJSON, default=list)
    action_type = Column(SQLAlchemyEnum(ActionTypeEnum), nullable=False)
    goal = Column(Text, nullable=False)
    status = Column(SQLAlchemyEnum(SwarmNodeStatusEnum), default=SwarmNodeStatusEnum.ACTIVE)
    termination_policy = Column(SQLAlchemyEnum(TerminationPolicyEnum), default=TerminationPolicyEnum.SIMPLE)
    logs = Column(SQLiteJSON, default=list)
    report = Column(Text, nullable=True)
    context = Column(SQLiteJSON, default=dict)

    children = relationship("SwarmNodeModel", backref='parent', remote_side=[id])
    operations = relationship("BaseOperationModel", backref='swarm_node', cascade="all, delete-orphan")
