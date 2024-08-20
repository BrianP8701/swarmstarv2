from sqlalchemy import Column
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.enums.tool_type_enum import ToolTypeEnum


class ToolMetadataNodeModel(BaseSQLAlchemyModel):
    __tablename__ = "tool_metadata_nodes"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    parent_id = Column(String, ForeignKey("tool_metadata_nodes.id"), nullable=True)
    children_ids = Column(SQLiteJSON, default=lambda: [])
    tool_type = Column(SQLAlchemyEnum(ToolTypeEnum), nullable=False)

    children = relationship("ToolMetadataNodeModel", backref="parent", remote_side=[id])
