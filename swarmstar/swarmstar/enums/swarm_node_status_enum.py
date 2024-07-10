from enum import Enum

class SwarmNodeStatusEnum(Enum):
    ACTIVE = 'active'
    WAITING = 'waiting'
    TERMINATED = 'terminated'
    PAUSED = 'paused'
