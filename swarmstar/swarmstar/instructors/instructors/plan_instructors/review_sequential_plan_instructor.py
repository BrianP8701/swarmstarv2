from typing import List, Optional

from pydantic import Field

from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructors.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.operations.base_operation import BaseOperation


class ReviewSequentialPlanInstructor(BaseInstructor):
    analysis: str = Field(
        ...,
        description="Analyze the list of steps and determine if they can be executed in sequence or if they should be revised.",
    )
    confirmation: bool = Field(
        ...,
        description="After analysis, conclusively provide a confirmation of whether the steps can be executed in sequence or if they need to be revised. If they can be executed in sequence, output 'true'. If they need to be revised, output 'false'.",
    )
    feedback: str = Field(
        ...,
        description="Provide feedback on why the steps cannot be executed in sequence. This feedback should be actionable and specific to the steps that need to be revised.",
    )

    @staticmethod
    def write_instructions(
        goal: str, steps: List[str], context: Optional[str] = None
    ) -> List[Message]:
        return [
            Message(
                role=MessageRoleEnum.USER,
                content=f"The steps are: {steps}. Please analyze if they must be executed in sequence."
                + (f"\n\nContext: {context}" if context else ""),
            )
        ]

    @staticmethod
    def write_content(steps: List[str]) -> str:
        return f"The steps are: {steps}. Please analyze if this plan is valid and can be executed in sequence."

    @classmethod
    async def review_plan(
        cls,
        goal: str,
        steps: List[str],
        context: Optional[str],
        action_node_id: Optional[str],
    ) -> "ReviewSequentialPlanInstructor":
        return await cls.get_client().instruct(
            messages=cls.write_instructions(goal, steps, context),
            instructor_model=cls,
            action_node_id=action_node_id,
        )
