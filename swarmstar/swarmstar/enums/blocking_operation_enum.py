from enum import Enum

class BlockingOperationEnum(str, Enum):
    SEND_USER_MESSAGE = 'send_user_message'
    INSTRUCTOR_CALL = 'instructor_call'
    CHATGPT_CALL = 'chatgpt_call'
