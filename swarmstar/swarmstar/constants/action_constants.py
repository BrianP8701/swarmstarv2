from typing import Dict, Type

from swarmstar.actions.plan.parallel_plan import ParallelPlan
from swarmstar.actions.plan.sequential_plan import SequentialPlan
from swarmstar.actions.route.route_action import RouteAction
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.objects.nodes.base_action_node import BaseActionNode

ACTION_ENUM_TO_ACTION_NODE_CLASS: Dict[ActionEnum, Type[BaseActionNode]] = {
    ActionEnum.PARALLEL_PLAN: ParallelPlan,
    ActionEnum.SEQUENTIAL_PLAN: SequentialPlan,
    ActionEnum.ROUTE_ACTION: RouteAction
}
