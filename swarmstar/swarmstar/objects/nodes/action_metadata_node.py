"""
Action metadata labels actions with descriptions.

Actions are predefined chains of logic, sprinkled with spots of ai
and human interaction to produce intelligent behavior.

Every action can be found in swarmstar/actions

I'm excited to create the action, "create_action".
"""
from typing import ClassVar, Type

from data.enums import DatabaseTableEnum
from data.models.action_metadata_node_model import ActionMetadataNodeModel
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode


class ActionMetadataNode(BaseMetadataNode["ActionMetadataNode"]):
    table_enum = DatabaseTableEnum.ACTION_METADATA_NODES

    action_enum: ActionEnum
    description: str
