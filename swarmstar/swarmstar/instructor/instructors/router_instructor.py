from pydantic import  Field
from typing import List
from swarmstar.enums.message_role_enum import MessageRoleEnum

from swarmstar.instructor.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode

class RouterInstructor(BaseInstructor):
    best_option: int = Field(description="The index of the best option. 0 if there is no viable option.")
    unviable_options: List[int] = Field(description="The indices of the options that are unviable")

    @staticmethod
    def generate_instruction(children: List[BaseMetadataNode], content: str, system_message: str) -> List[Message]:
        options = [f"{i}. {child.title}: {child.description}" for i, child in enumerate(children)]
        options = "\n".join(options)
        return [
            Message(
                role=MessageRoleEnum.SYSTEM,
                content=f"{system_message}\n\n"
            ),
            Message(
                role=MessageRoleEnum.USER,
                content=f"Message to be routed: {content}\n\nOptions:\n{options}"
            )
        ]
