from enum import Enum

class OperationEnum(str, Enum):
    SPAWN = "spawn"
    TERMINATE = "terminate"
    BLOCKING = "blocking"
    COMMUNICATION = "communication"
    ACTION = "action"
