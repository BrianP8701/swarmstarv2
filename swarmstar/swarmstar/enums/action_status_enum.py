from enum import Enum


class ActionStatusEnum(str, Enum):
    ACTIVE = "active"
    WAITING = "waiting"
    WAITING_FOR_USER_INPUT = "waiting_for_user_input"
    TERMINATED = "terminated"
    PAUSED = "paused"
    ERROR = "error"
