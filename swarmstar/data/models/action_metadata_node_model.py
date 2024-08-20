from sqlalchemy import Column
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship

from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.enums.action_enum import ActionEnum


class ActionMetadataNodeModel(BaseSQLAlchemyModel):
    __tablename__ = "action_metadata_nodes"

    id = Column(String, primary_key=True)
    description = Column(Text, nullable=False)
    action_enum = Column(SQLAlchemyEnum(ActionEnum), nullable=False)

    parent_id = Column(String, ForeignKey("action_metadata_nodes.id"), nullable=True)

    children = relationship(
        "ActionMetadataNodeModel", backref="parent", remote_side=[id]
    )
