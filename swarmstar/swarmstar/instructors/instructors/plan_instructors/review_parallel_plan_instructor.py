from typing import List, Optional

from pydantic import Field

from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructors.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.operations.base_operation import BaseOperation


class ReviewParallelPlanInstructor(BaseInstructor):
    analysis: str = Field(
        ...,
        description="Analyze the list of subgoals and determine if they can be executed in parallel or if they need to be revised. Go through each one and consider whether any subgoal relies on the completion of another subgoal.",
    )
    confirmation: bool = Field(
        ...,
        description="After analysis, conclusively provide a confirmation of whether the subgoals can be executed in parallel or if they need to be revised. If they can be executed in parallel, output 'true'. If they need to be revised, output 'false'.",
    )
    feedback: str = Field(
        ...,
        description="Provide feedback on why the subgoals cannot be executed in parallel. This feedback should be actionable and specific to the subgoals that need to be revised.",
    )

    @staticmethod
    def write_instructions(
        goal: str, subgoals: List[str], context: Optional[str] = None
    ) -> List[Message]:
        return [
            Message(
                role=MessageRoleEnum.USER,
                content=f"The subgoals are: {subgoals}. Please analyze if they can be executed in parallel."
                + (f"\n\nContext: {context}" if context else ""),
            )
        ]

    @staticmethod
    def write_content(subgoals: List[str]) -> str:
        return f"The subgoals are: {subgoals}. Please analyze if this plan is valid and can be executed in parallel."

    @classmethod
    async def review_plan(
        cls,
        goal: str,
        subgoals: List[str],
        context: Optional[str],
        action_node_id: Optional[str],
    ) -> "ReviewParallelPlanInstructor":
        return await cls.get_client().instruct(
            messages=cls.write_instructions(goal, subgoals, context),
            instructor_model=cls,
            action_node_id=action_node_id,
        )
