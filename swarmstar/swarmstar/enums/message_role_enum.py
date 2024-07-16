from enum import Enum

class MessageRoleEnum(str, Enum):
    USER = 'user'
    SYSTEM = 'system'
    ASSISTANT = 'assistant'
    SWARMSTAR = 'swarmstar'
 