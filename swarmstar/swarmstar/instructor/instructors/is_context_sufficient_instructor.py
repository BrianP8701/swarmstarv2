from typing import List, Optional
from pydantic import Field
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructor.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.operations.base_operation import BaseOperation


class IsContextSufficientInstructor(BaseInstructor):
    is_context_sufficient_boolean: bool = Field(description="Do we have enough information to do what we need to do?")

    @staticmethod
    def write_instructions(content: str, context: Optional[str] = None) -> List[Message]:
        """
        Generates a list of messages to determine if the context is sufficient.

        :param content: The content for which context is being ensured.
        :param context: The optional context to be included in the message.
        :return: A list of Message objects.
        """
        user_content = f"What we need to do: {content}"
        if context:
            user_content += f"\n\nContext: {context}"
        
        return [
            Message(role=MessageRoleEnum.SYSTEM, content="Determine if we have enough information to do what we need to do."),
            Message(role=MessageRoleEnum.USER, content=user_content)
        ]

    @classmethod
    async def is_context_sufficient(cls, content: str, context: Optional[str] = None, operation: Optional[BaseOperation] = None) -> 'IsContextSufficientInstructor':
        return await cls.client.instruct(
            cls.write_instructions(content, context),
            cls,
            operation=operation
        )
