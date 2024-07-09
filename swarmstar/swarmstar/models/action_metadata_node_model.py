from sqlalchemy import Column, ForeignKey, String, Enum as SQLAlchemyEnum, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class ActionMetadataNodeModel(BaseSQLAlchemyModel):
    __tablename__ = 'action_metadata_nodes'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    parent_id = Column(String, ForeignKey('action_metadata_nodes.id'), nullable=True)
    children_ids = Column(SQLiteJSON, default=list)
    action_type = Column(SQLAlchemyEnum(ActionTypeEnum), nullable=False)

    children = relationship("ActionMetadataNodeModel", backref='parent', remote_side=[id])
