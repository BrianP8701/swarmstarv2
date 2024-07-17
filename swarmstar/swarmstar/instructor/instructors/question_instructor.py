from typing import List, Optional
from pydantic import BaseModel, Field
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.objects.message import Message


class QuestionInstructor(BaseModel):
    do_we_need_search: bool = Field(description="Do we need more information to execute on this goal?")
    questions: Optional[List[str]] = Field(description="If so, what questions do we need answered?")
    context: Optional[str] = Field(description="Context for the node that will perform a search to answer the questions. If questions are asked.")
    
    @staticmethod
    def generate_instruction(content: str) -> List[Message]:
        return [
            Message(role=MessageRoleEnum.SYSTEM, content="Ask questions if needed to execute the goal."),
            Message(role=MessageRoleEnum.USER, content=content)
        ]
