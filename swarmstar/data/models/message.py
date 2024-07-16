from sqlalchemy import Column, ForeignKey, String, Enum as SQLAlchemyEnum, Text
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.orm import relationship
from swarmstar.enums import message_role_enum

from swarmstar.enums.memory_type_enum import MemoryTypeEnum
from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class MessageModel(BaseSQLAlchemyModel):
    __tablename__ = 'messages'

    id = Column(String, primary_key=True)
    content = Column(Text, nullable=False)
    role = Column(SQLAlchemyEnum(message_role_enum), nullable=False)
