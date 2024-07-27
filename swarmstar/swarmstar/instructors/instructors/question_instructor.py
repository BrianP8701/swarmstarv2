from typing import List, Optional
from pydantic import Field
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructors.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.operations.base_operation import BaseOperation


class QuestionInstructor(BaseInstructor):
    questions: List[str] = Field(description="It seems like we need more information to do this. Ask questions to get more information. ")
    context: str = Field(description="If applicable, provide context for the questions.")
    
    @staticmethod
    def write_instructions(content: str, context: Optional[str] = None) -> List[Message]:
        return [
            Message(role=MessageRoleEnum.SYSTEM, content="Ask questions to gather the necessary information. Provide relevant context with each question, and include any general context in the dedicated context section."),
            Message(role=MessageRoleEnum.USER, content=f"What we need to do: {content}" + (f"\n\nContext: {context}" if context else ""))
        ]

    @classmethod
    async def ask_questions(
        cls, 
        content: str, 
        context: Optional[str], 
        action_node_id: Optional[str]
    ) -> "QuestionInstructor":
        instructions = cls.write_instructions(content, context)
        response = await cls.client.instruct(
            messages=instructions,
            instructor_model=cls,
            action_node_id=action_node_id
        )
        return response
