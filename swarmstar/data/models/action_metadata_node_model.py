from sqlalchemy import ARRAY, Column, ForeignKey, String, Enum as SQLAlchemyEnum, Text
from sqlalchemy.orm import relationship

from swarmstar.enums.action_enum import ActionEnum
from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class ActionMetadataNodeModel(BaseSQLAlchemyModel):
    __tablename__ = 'action_metadata_nodes'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    parent_id = Column(String, ForeignKey('action_metadata_nodes.id'), nullable=True)
    children_ids = Column(ARRAY(String), default=lambda: [])
    action_enum = Column(SQLAlchemyEnum(ActionEnum), nullable=False)

    children = relationship("ActionMetadataNodeModel", backref='parent', remote_side=[id])
