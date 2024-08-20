from swarmstar.constants.misc_constants import MAX_PLAN_ATTEMPTS
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.instructors.instructors.plan_instructors.review_sequential_plan_instructor import (
    ReviewSequentialPlanInstructor,
)
from swarmstar.instructors.instructors.plan_instructors.sequential_plan_instructor import (
    SequentialPlanInstructor,
)
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.operations.spawn_operation import SpawnOperation
from swarmstar.shapes.contexts.sequential_plan_context import SequentialPlanContext


class SequentialPlan(BaseActionNode):
    node_id = "sequential_plan"
    parent_id = "plan"
    title = "Sequential Plan"
    action_enum = ActionEnum.SEQUENTIAL_PLAN
    description = """
    Use this action to break down complex tasks into a series of ordered steps. 
    Ideal for tasks where each step depends on the completion of the previous one. 
    The goal is to create a clear, linear plan that can be executed step-by-step.
    """

    context: SequentialPlanContext

    async def main(self) -> SpawnOperation:
        is_context_sufficient = await self.is_context_sufficient(self.goal)
        if not is_context_sufficient:
            return await self.ask_questions(self.goal)
        return await self.generate_plan()

    async def generate_plan(self) -> SpawnOperation:
        self.context.attempts += 1
        sequential_plan = await SequentialPlanInstructor.generate_plan(
            self.goal,
            self.get_most_recent_context(),
            self.context.get_most_recent_plan_review_feedback(),
            self.context.get_most_recent_sequential_plan_attempt(),
            self.id,
        )
        review_plan = await ReviewSequentialPlanInstructor.review_plan(
            self.goal, sequential_plan.steps, self.get_most_recent_context(), self.id
        )

        if review_plan.confirmation:
            return SpawnOperation(
                swarm_id=self.swarm_id,
                action_node_id="sequential_plan",
                goal=sequential_plan.steps[0],
                action_enum=ActionEnum.ROUTE_ACTION,
                context=SequentialPlanContext(),
            )
        else:
            if self.context.attempts < MAX_PLAN_ATTEMPTS:
                return await self.generate_plan()
            else:
                raise Exception(f"Plan exceeded max attempts on action node {self.id}")
