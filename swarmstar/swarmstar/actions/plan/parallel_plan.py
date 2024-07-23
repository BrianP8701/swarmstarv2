from typing import ClassVar, List
from swarmstar.constants.misc_constants import MAX_PLAN_ATTEMPTS
from swarmstar.shapes.contexts.parallel_plan_context import ParallelPlanContext
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructor.instructor import Instructor
from swarmstar.instructor.instructors.plan_instructor import ParallelPlanInstructor, ReviewParallelPlanInstructor
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.message import Message
from swarmstar.objects.operations.spawn_operation import SpawnOperation

instructor = Instructor()

class ParallelPlan(BaseActionNode):
    __id__: ClassVar[str] = "parallel_plan"
    __parent_id__: ClassVar[str] = "plan"
    __title__: ClassVar[str] = "Parallel Plan"
    __action_enum__: ClassVar[ActionEnum] = ActionEnum.PARALLEL_PLAN
    __node_context_class__: ClassVar[ParallelPlanContext]
    __description__: ClassVar[str] = """
    Select this action to divide the task into independent subgoals that can be pursued simultaneously. 
    Suitable for tasks that can be parallelized to optimize time and resource usage. 
    The goal is to create a set of concurrent tasks that contribute to the overall objective.
    """
    
    context: ParallelPlanContext

    async def main(self) -> List[SpawnOperation]:
        while self.context.attempts < MAX_PLAN_ATTEMPTS:
            plan = await self.generate_plan(self.goal)
            review_plan_instructor_response = await instructor.instruct(
                messages=ReviewParallelPlanInstructor.generate_instructions(plan.plan),
                instructor_model=ReviewParallelPlanInstructor,
                operation=self.operation
            )

            plan = plan.plan
            is_plan_complete = review_plan_instructor_response.confirmation

            if is_plan_complete:
                return [SpawnOperation(
                    swarm_node_id=self.node.id,
                    goal=subgoal,
                    action_type=ActionEnum.ROUTE_ACTION
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

    @BaseActionNode.question_wrapper
    async def generate_plan(self, content: str) -> ParallelPlanInstructor:
        instructions = ParallelPlanInstructor.generate_instructions(content)
        self.context.conversation.extend(instructions)
        return await instructor.instruct(
            messages=self.context.conversation,
            instructor_model=ParallelPlanInstructor,
            operation=self.operation
        )
    