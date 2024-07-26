from typing import ClassVar, List, Union

from swarmstar.constants.misc_constants import MAX_PLAN_ATTEMPTS
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.instructor.instructors.plan_instructors.sequential_plan_instructor import SequentialPlanInstructor
from swarmstar.instructor.instructors.plan_instructors.review_sequential_plan_instructor import ReviewSequentialPlanInstructor
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation
from swarmstar.shapes.contexts.sequential_plan_context import SequentialPlanContext


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

    async def main(self) -> Union[List[BaseOperation], SpawnOperation]:
        is_context_sufficient = await self.is_context_sufficient(self.context.goal)
        if not is_context_sufficient:
            return [await self.ask_questions(self.context.goal)]
        return await self.generate_plan()

    async def generate_plan(self) -> Union[List[BaseOperation], SpawnOperation]:
        self.context.attempts += 1
        sequential_plan = await SequentialPlanInstructor.generate_plan(
            self.context.goal, 
            self.context.get_most_recent_context(), 
            self.context.get_most_recent_plan_review_feedback(),
            self.context.get_most_recent_sequential_plan_attempt(),
            self.operation
        )
        review_plan = await ReviewSequentialPlanInstructor.review_plan(
            self.context.goal,
            sequential_plan.steps, 
            self.context.get_most_recent_context(), 
            self.operation
        )

        if review_plan.confirmation:
            return SpawnOperation(
                action_node_id="sequential_plan",
                goal=sequential_plan.steps[0],
                action_enum=ActionEnum.ROUTE_ACTION,
                context=self.context
            )
        else:
            if self.context.attempts < MAX_PLAN_ATTEMPTS:
                return await self.generate_plan()
            else:
                raise Exception(f"Plan exceeded max attempts on action node {self.id}")
