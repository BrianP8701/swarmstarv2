from enum import Enum

class MessageRole(str, Enum):
    USER = 'user'
    SWARMSTAR = 'swarmstar'
    SYSTEM = 'system'
    ASSISTANT = 'assistant'
