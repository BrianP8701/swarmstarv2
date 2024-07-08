from pydantic import BaseModel
from swarmstar.enums.message_role_enum import MessageRole

class Message(BaseModel):
    role: MessageRole
    content: str
    input_tokens: int
    output_tokens: int
    timestamp: str
