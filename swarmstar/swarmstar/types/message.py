from pydantic import BaseModel
from swarmstar.enums.ai_model import AiModel
from swarmstar.enums.message_role import MessageRole

class Message(BaseModel):
    role: MessageRole
    content: str
    input_tokens: int
    output_tokens: int
    timestamp: str
