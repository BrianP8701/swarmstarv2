from typing import List
from swarmstar.actions.base_action import BaseAction
from swarmstar.constants.misc_constants import MAX_PLAN_ATTEMPTS
from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructor.instructor import Instructor
from swarmstar.instructor.instructors.plan_instructor import PlanInstructor, ReviewPlanInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.operations.spawn_operation import SpawnOperation

instructor = Instructor()

class Plan(BaseAction):
    async def main(self) -> List[SpawnOperation]:
        attempts = 0
        conversation: List[Message] = PlanInstructor.generate_instructions(self.node.goal)

        while attempts < MAX_PLAN_ATTEMPTS:
            plan_instructor_response = await instructor.instruct(
                messages=conversation,
                instructor_model=PlanInstructor,
                operation=self.operation
            )
            review_plan_instructor_response = await instructor.instruct(
                messages=ReviewPlanInstructor.generate_instructions(plan_instructor_response.plan),
                instructor_model=ReviewPlanInstructor,
                operation=self.operation
            )
            
            plan = plan_instructor_response.plan
            is_plan_complete = review_plan_instructor_response.confirmation

            if is_plan_complete:
                return [SpawnOperation(
                    swarm_node_id=self.node.id,
                    goal=subgoal,
                    action_type=ActionTypeEnum.ROUTE_ACTION
                ) for subgoal in plan]
            else:
                conversation.extend([
                        Message(
                            content=str(plan),
                            role=MessageRoleEnum.ASSISTANT
                        ),
                        Message(
                            content=review_plan_instructor_response.analysis,
                            role=MessageRoleEnum.ASSISTANT
                        ),
                        Message(
                            content="This is not a valid plan, it cannot be executed in parallel.",
                            role=MessageRoleEnum.ASSISTANT
                        )
                    ]
                )

        raise Exception(f"Plan exceeded max attempts on swarm node {self.node.id}")
