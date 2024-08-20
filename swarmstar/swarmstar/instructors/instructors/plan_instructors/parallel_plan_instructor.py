from typing import List, Optional

from pydantic import Field

from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructors.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.operations.base_operation import BaseOperation


class ParallelPlanInstructor(BaseInstructor):
    plan: List[str] = Field(
        ...,
        description="Break the goal into actionable subgoals that can be worked toward in parallel. Provide necessary context for each subgoal. It is possible that only one subgoal is needed.",
    )

    @staticmethod
    def write_instructions(
        goal: str,
        context: Optional[str] = None,
        review: Optional[str] = None,
        last_plan_attempt: Optional[List[str]] = None,
    ) -> List[Message]:
        return [
            Message(
                role=MessageRoleEnum.USER,
                content=f"The goal is: {goal}. Please break it down into parallel subgoals."
                + (f"\n\nContext: {context}" if context else ""),
            ),
            Message(
                role=MessageRoleEnum.USER,
                content=f"The last plan attempt was: {last_plan_attempt}. It did not pass review, here is the feedback: {review}.",
            ),
        ]

    @staticmethod
    def write_content(goal: str) -> str:
        return f"The goal is: {goal}. Please break it down into parallel subgoals."

    @classmethod
    async def generate_plan(
        cls,
        goal: str,
        context: Optional[str],
        review: Optional[str],
        last_plan_attempt: Optional[List[str]],
        action_node_id: Optional[str],
    ) -> "ParallelPlanInstructor":
        return await cls.get_client().instruct(
            messages=cls.write_instructions(goal, context, review, last_plan_attempt),
            instructor_model=cls,
            action_node_id=action_node_id,
        )
