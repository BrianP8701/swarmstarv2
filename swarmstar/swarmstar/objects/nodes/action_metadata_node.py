"""
Action metadata labels actions with descriptions.

Actions are predefined chains of logic, sprinkled with spots of ai
and human interaction to produce intelligent behavior.

Every action can be found in swarmstar/actions

I'm excited to create the action, "create_action".
"""
from typing import Type, ClassVar
from swarmstar.constants.action_constants import ACTION_ENUM_TO_ACTION_CLASS

from swarmstar.enums.action_type_enum import ActionTypeEnum
from data.models.action_metadata_node_model import ActionMetadataNodeModel
from swarmstar.actions.base_action import BaseAction
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode

class ActionMetadataNode(BaseMetadataNode['ActionMetadataNode']):
    __table__: ClassVar[str] = "action_metadata_nodes"
    __object_model__: ClassVar[Type['ActionMetadataNodeModel']] = ActionMetadataNodeModel

    goal: str
    action_type: ActionTypeEnum

    def get_action_class(self) -> Type[BaseAction]:
        """ Returns an uninstantiated action class. """
        return ACTION_ENUM_TO_ACTION_CLASS[self.action_type]
