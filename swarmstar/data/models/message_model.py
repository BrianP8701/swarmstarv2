from sqlalchemy import Column
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, String, Text

from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.enums import MessageRoleEnum


class MessageModel(BaseSQLAlchemyModel):
    __tablename__ = "messages"

    id = Column(String, primary_key=True)
    content = Column(Text, nullable=False)
    role = Column(SQLAlchemyEnum(MessageRoleEnum), nullable=False)

    action_node_id = Column(String, ForeignKey("action_nodes.id"), nullable=False)
