from sqlalchemy import Column, ForeignKey, String, Boolean, Enum as SQLAlchemyEnum, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class SwarmNodeModel(BaseSQLAlchemyModel):
    __tablename__ = 'swarm_nodes'

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    parent_id = Column(String, ForeignKey('swarm_nodes.id'), nullable=True)
    children_ids = Column(SQLiteJSON, default=list)
    action = Column(SQLAlchemyEnum(ActionEnum), nullable=False)
    goal = Column(Text, nullable=False)
    alive = Column(Boolean, default=True)
    active = Column(Boolean, default=True)
    termination_policy = Column(SQLAlchemyEnum(TerminationPolicyEnum), default=TerminationPolicyEnum.SIMPLE)
    logs = Column(SQLiteJSON, default=list)
    report = Column(Text, nullable=True)
    execution_memory = Column(SQLiteJSON, default=dict)
    context = Column(SQLiteJSON, default=dict)

    children = relationship("SwarmNodeModel", backref='parent', remote_side=[id])
    operations = relationship("BaseOperationModel", backref='swarm_node', cascade="all, delete-orphan")
