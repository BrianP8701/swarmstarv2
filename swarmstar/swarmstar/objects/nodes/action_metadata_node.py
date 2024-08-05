"""
Action metadata labels actions with descriptions.

Actions are predefined chains of logic, sprinkled with spots of ai
and human interaction to produce intelligent behavior.

Every action can be found in swarmstar/actions

I'm excited to create the action, "create_action".
"""
from typing import Type, ClassVar

from swarmstar.enums.action_enum import ActionEnum
from data.models.action_metadata_node_model import ActionMetadataNodeModel
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode

class ActionMetadataNode(BaseMetadataNode['ActionMetadataNode']):
    table_enum: ClassVar[str] = "action_metadata_nodes"
    database_model_class: ClassVar[Type['ActionMetadataNodeModel']] = ActionMetadataNodeModel

    action_enum: ActionEnum
    description: str
