from typing import ClassVar, List
from swarmstar.constants.misc_constants import MAX_PLAN_ATTEMPTS
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructor.instructor_client import Instructor
from swarmstar.instructor.instructors.plan.parallel_plan_instructor import ParallelPlanInstructor, ReviewParallelPlanInstructor
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.message import Message
from swarmstar.objects.operations.spawn_operation import SpawnOperation

instructor = Instructor()

class Code(BaseActionNode):
    __id__: ClassVar[str] = "code"
    __parent_id__: ClassVar[str] = "root"
    __title__: ClassVar[str] = "Code"
    __action_enum__: ClassVar[ActionEnum] = ActionEnum.CODE
    __description__: ClassVar[str] = """
    Select this action only if the task can be completed in a single prompt. 
    The task should be small, well-defined, and not require further decomposition. 
    Ideal for straightforward coding tasks like writing a specific function or fixing a bug.
    """
