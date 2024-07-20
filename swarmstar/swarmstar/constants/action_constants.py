from typing import Dict, Type

from swarmstar.actions.base_action import BaseAction
from swarmstar.actions.plan.parallel_plan import ParallelPlan
from swarmstar.enums.action_enum import ActionEnum

ACTION_ENUM_TO_ACTION_CLASS: Dict[ActionEnum, Type[BaseAction]] = {
    ActionEnum.PLAN: ParallelPlan
}
