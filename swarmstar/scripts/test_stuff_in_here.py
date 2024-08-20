from swarmstar.actions.general.plan.parallel_plan import ParallelPlan
from swarmstar.shapes.contexts.parallel_plan_context import ParallelPlanContext

node = ParallelPlan(goal="test", context=ParallelPlanContext(), swarm_id="test")

print("ParallelPlan object created:", node)
print(node.model_dump())
