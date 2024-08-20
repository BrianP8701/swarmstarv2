from sqlalchemy import Column
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.enums.memory_type_enum import MemoryTypeEnum


class MemoryMetadataNodeModel(BaseSQLAlchemyModel):
    __tablename__ = "memory_metadata_nodes"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    memory_type = Column(SQLAlchemyEnum(MemoryTypeEnum), nullable=False)

    parent_id = Column(String, ForeignKey("memory_metadata_nodes.id"), nullable=True)
    children = relationship(
        "MemoryMetadataNodeModel", backref="parent", remote_side=[id]
    )
