from typing import Dict, Type

from swarmstar.actions.base_action import BaseAction
from swarmstar.actions.general.plan import Plan
from swarmstar.enums.action_type_enum import ActionTypeEnum

ACTION_ENUM_TO_ACTION_CLASS: Dict[ActionTypeEnum, Type[BaseAction]] = {
    ActionTypeEnum.PLAN: Plan
}
