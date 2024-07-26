from typing import List, Optional
from pydantic import Field
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructor.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.operations.base_operation import BaseOperation

class RouterInstructor(BaseInstructor):
    best_option: int = Field(description="The index of the best option. 0 if there is no viable option.")
    unviable_options: List[int] = Field(description="The indices of the options that are unviable")

    @classmethod
    def write_instructions(cls, options: List[str], content: str, system_message: str) -> List[Message]:
        formatted_options = cls._format_options(options, content)
        return [
            Message(
                role=MessageRoleEnum.SYSTEM,
                content=f"{system_message}\n\n"
            ),
            Message(
                role=MessageRoleEnum.USER,
                content=f"Message to be routed: {content}\n\nOptions:\n{formatted_options}"
            )
        ]

    @classmethod
    async def route(cls, options: List[str], content: str, system_message: str, operation: Optional[BaseOperation] = None) -> 'RouterInstructor':
        return await cls.client.instruct(
            messages=cls.write_instructions(options, content, system_message),
            instructor_model=cls,
            operation=operation
        )

    @classmethod
    def _format_options(cls, options: List[str], prompt: str) -> str:
       return "Prompt: {}\nOptions:\n{}".format(
            prompt,
            '\n'.join(["{}. {}".format(i + 1, option) for i, option in enumerate(options)])
        )
