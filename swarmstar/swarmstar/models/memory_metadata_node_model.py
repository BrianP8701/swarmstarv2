from sqlalchemy import Column, ForeignKey, String, Enum as SQLAlchemyEnum, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from swarmstar.enums.memory_type_enum import MemoryTypeEnum
from swarmstar.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class MemoryMetadataNodeModel(BaseSQLAlchemyModel):
    __tablename__ = 'memory_metadata_nodes'

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    parent_id = Column(String, ForeignKey('action_metadata_nodes.id'), nullable=True)
    children_ids = Column(SQLiteJSON, default=list)
    memory_type = Column(SQLAlchemyEnum(MemoryTypeEnum), nullable=False)

    children = relationship("ActionMetadataNodeModel", backref='parent', remote_side=[id])
