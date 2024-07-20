from enum import Enum

class ActionStatusEnum(Enum):
    ACTIVE = 'active'
    WAITING = 'waiting'
    TERMINATED = 'terminated'
    PAUSED = 'paused'
