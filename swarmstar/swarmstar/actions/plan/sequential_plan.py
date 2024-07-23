from typing import ClassVar, List
from swarmstar.constants.misc_constants import MAX_PLAN_ATTEMPTS
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructor.instructor import Instructor
from swarmstar.instructor.instructors.plan_instructor import ParallelPlanInstructor, ReviewParallelPlanInstructor
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.message import Message
from swarmstar.objects.operations.spawn_operation import SpawnOperation
from swarmstar.shapes.contexts.sequential_plan_context import SequentialPlanContext

instructor = Instructor()

class SequentialPlan(BaseActionNode):
    __id__: ClassVar[str] = "sequential_plan"
    __parent_id__: ClassVar[str] = "plan"
    __title__: ClassVar[str] = "Sequential Plan"
    __action_enum__: ClassVar[ActionEnum] = ActionEnum.SEQUENTIAL_PLAN
    __context_class__: ClassVar[SequentialPlanContext]
    __description__: ClassVar[str] = """
    Use this action to break down complex tasks into a series of ordered steps. 
    Ideal for tasks where each step depends on the completion of the previous one. 
    The goal is to create a clear, linear plan that can be executed step-by-step.
    """
    
    context: SequentialPlanContext

    async def main(self) -> List[SpawnOperation]:
        attempts = 0
        conversation: List[Message] = ParallelPlanInstructor.generate_instructions(self.context.goal)

        

        