from typing import List, Optional
from pydantic import Field
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructors.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message

class RouterInstructor(BaseInstructor):
    best_option: Optional[int] = Field(description="The index of the best option. None if there is no viable option.")
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
    async def route(
        cls, 
        options: List[str], 
        content: str, 
        system_message: str, 
        action_node_id: Optional[str]
    ) -> 'RouterInstructor':
        instructor = await cls.get_client().instruct(
            messages=cls.write_instructions(options, content, system_message),
            instructor_model=cls,
            action_node_id=action_node_id
        )
        if instructor.best_option is not None:
            instructor.best_option -= 1
        instructor.unviable_options = [opt - 1 for opt in instructor.unviable_options]
        return instructor

    @classmethod
    def _format_options(cls, options: List[str], prompt: str) -> str:
       return "Prompt: {}\nOptions:\n{}".format(
            prompt,
            '\n'.join(["{}. {}".format(i + 1, option) for i, option in enumerate(options)])
        )
