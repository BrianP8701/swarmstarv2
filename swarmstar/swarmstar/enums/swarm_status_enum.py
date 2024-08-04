from enum import Enum

class SwarmStatusEnum(str, Enum):
    ACTIVE = "active"
    WAITING_FOR_USER_INPUT = "waiting_for_user_input"
    COMPLETED = "completed"
    PAUSED = "paused"
    ERROR = "error"
