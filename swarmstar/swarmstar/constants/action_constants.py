from typing import Dict, Type

from swarmstar.actions.plan.parallel_plan import ParallelPlan
from swarmstar.actions.plan.sequential_plan import SequentialPlan
from swarmstar.actions.route.route_action import RouteAction
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.shapes import (
    BaseContext,
    ParallelPlanContext,
    RouteActionContext,
    SequentialPlanContext,
)

ACTION_PROPERTIES = {
    ActionEnum.PARALLEL_PLAN: {
        "node_class": ParallelPlan,
        "context_class": ParallelPlanContext,
    },
    ActionEnum.SEQUENTIAL_PLAN: {
        "node_class": SequentialPlan,
        "context_class": SequentialPlanContext,
    },
    ActionEnum.ROUTE_ACTION: {
        "node_class": RouteAction,
        "context_class": RouteActionContext,
    },
}

ACTION_ENUM_TO_ACTION_NODE_CLASS: Dict[ActionEnum, Type[BaseActionNode]] = {
    k: v["node_class"] for k, v in ACTION_PROPERTIES.items()
}

ACTION_ENUM_TO_ACTION_NODE_CONTEXT: Dict[ActionEnum, Type[BaseContext]] = {
    k: v["context_class"] for k, v in ACTION_PROPERTIES.items()
}
