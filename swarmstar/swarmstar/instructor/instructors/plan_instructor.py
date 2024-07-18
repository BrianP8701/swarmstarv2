from pydantic import BaseModel, Field
from typing import List, Optional
from swarmstar.enums.message_role_enum import MessageRoleEnum

from swarmstar.instructor.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message

class PlanInstructor(BaseInstructor):
    plan: List[str] = Field(..., description="Break the goal into actionable subgoals that can be worked torward in parallel. Provide necessary context for each subgoal. It is possible that only one subgoal is needed.")

    @staticmethod
    def generate_instructions(goal: str) -> List[Message]:
        return [
            Message(
                role=MessageRoleEnum.USER,
                content=f"The goal is: {goal}"
            )
        ]

class ReviewPlanInstructor(BaseInstructor):
    analysis: str = Field(..., description="Analyze the list of subgoals and determine if they can be executed in parallel or if they need to be revised. Go through each one and consider whether any subgoal relies on the completion of another subgoal.")
    confirmation: bool = Field(..., description="After analysis, conclusively provide a confirmation of whether the subgoals can be executed in parallel or if they need to be revised. If they can be executed in parallel, output 'true'. If they need to be revised, output 'false'.")

    @staticmethod
    def generate_instructions(subgoals: List[str]) -> List[Message]:
        return [
            Message(
                role=MessageRoleEnum.USER,
                content=f"The subgoals are: {subgoals}"
            )
        ]
