from sqlalchemy import Column, ForeignKey, String, Enum as SQLAlchemyEnum, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from swarmstar.enums.tool_type_enum import ToolTypeEnum
from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class ToolMetadataNodeModel(BaseSQLAlchemyModel):
    __tablename__ = 'tool_metadata_nodes'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    parent_id = Column(String, ForeignKey('tool_metadata_nodes.id'), nullable=True)
    children_ids = Column(SQLiteJSON, default=lambda: [])
    tool_type = Column(SQLAlchemyEnum(ToolTypeEnum), nullable=False)

    children = relationship("ToolMetadataNodeModel", backref='parent', remote_side=[id])
