from typing import ClassVar, List, Union
from swarmstar.constants.misc_constants import MAX_PLAN_ATTEMPTS
from swarmstar.shapes.contexts.parallel_plan_context import ParallelPlanContext
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.instructor.instructors.plan.parallel_plan_instructor import ParallelPlanInstructor
from swarmstar.instructor.instructors.plan.review_parallel_plan_instructor import ReviewParallelPlanInstructor
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation

class ParallelPlan(BaseActionNode):
    __id__: ClassVar[str] = "parallel_plan"
    __parent_id__: ClassVar[str] = "plan"
    __title__: ClassVar[str] = "Parallel Plan"
    __action_enum__: ClassVar[ActionEnum] = ActionEnum.PARALLEL_PLAN
    __context_class__: ClassVar[ParallelPlanContext]
    __description__: ClassVar[str] = """
    Select this action to divide the task into independent subgoals that can be pursued simultaneously. 
    Suitable for tasks that can be parallelized to optimize time and resource usage. 
    The goal is to create a set of concurrent tasks that contribute to the overall objective.
    """
    
    context: ParallelPlanContext

    async def main(self) -> Union[List[BaseOperation], SpawnOperation]:
        is_context_sufficient = await self.is_context_sufficient(self.context.goal)
        if not is_context_sufficient:
            return [await self.ask_questions(self.context.goal)]
        return await self.generate_plan()


    async def generate_plan(self) -> Union[List[BaseOperation], SpawnOperation]:
        self.context.attempts += 1
        parallel_plan = await ParallelPlanInstructor.generate_plan(
            self.context.goal, 
            self.context.get_most_recent_context(), 
            self.context.get_most_recent_plan_review_feedback(),
            self.context.get_most_recent_parallel_plan_attempt(),
            self.operation
        )
        review_plan = await ReviewParallelPlanInstructor.review_plan(
            self.context.goal,
            parallel_plan.plan, 
            self.context.get_most_recent_context(), 
            self.operation
        )

        if review_plan.confirmation:
            return [SpawnOperation(
                action_node_id="parallel_plan",
                goal=subgoal,
                action_enum=ActionEnum.ROUTE_ACTION,
                context=self.context
            ) for subgoal in parallel_plan.plan]
        else:
            self.context.parallel_plan_history.append(parallel_plan.plan)
            self.context.parallel_plan_review_feedback_history.append(review_plan.feedback)
            if self.context.attempts < MAX_PLAN_ATTEMPTS:
                return await self.generate_plan()
            else:
                raise Exception(f"Plan exceeded max attempts on action node {self.id}")
