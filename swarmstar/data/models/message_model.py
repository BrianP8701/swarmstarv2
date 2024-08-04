from sqlalchemy import Column, String, Enum as SQLAlchemyEnum, Text
from swarmstar.enums import MessageRoleEnum

from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class MessageModel(BaseSQLAlchemyModel):
    __tablename__ = 'messages'

    id = Column(String, primary_key=True)
    content = Column(Text, nullable=False)
    role = Column(SQLAlchemyEnum(MessageRoleEnum), nullable=False)
