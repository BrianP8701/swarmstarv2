

from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.objects.base_object import BaseObject


class Message(BaseObject['Message']):
    id: str
    content: str
    role: MessageRoleEnum
    