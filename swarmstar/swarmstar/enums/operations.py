from enum import Enum

class OperationEnum(str, Enum):
    SPAWN = "spawn"
    TERMINATE = "terminate"
    BLOCKING = "blocking"
    USER_COMMUNICATION = "user_communication"
    ACTION = "action"
