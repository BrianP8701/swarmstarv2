from typing import Dict, Optional

from swarmstar.enums.instructor_enum import InstructorEnum
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.objects.base_object import BaseObject


class Message(BaseObject["Message"]):
    id: str
    content: str
    role: MessageRoleEnum
    instructor_model: Optional[InstructorEnum] = None

    def convert_to_openai_message(self) -> Dict[str, str]:
        if self.role.value == "system" or self.role.value == "assistant":
            return {"content": self.content, "role": self.role.value}
        else:
            raise ValueError(f"Invalid role for openai messages: {self.role}")
