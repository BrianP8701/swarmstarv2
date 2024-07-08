from pydantic import BaseModel
from swarmstar.enums.message_role_enum import MessageRole

class BaseMessage(BaseModel):
    role: MessageRole
    content: str
