from typing import ClassVar
from data.models.action_metadata_node_model import ActionMetadataNodeModel
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.objects.trees.base_tree import BaseTree


class ActionMetadataTree(BaseTree):
    table_enum: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.ACTION_METADATA_NODES
    node_object: ClassVar[ActionMetadataNode]
    node_model: ClassVar[ActionMetadataNodeModel]
    branch_size_soft_limit: ClassVar[int]
    branch_size_hard_limit__: ClassVar[int]
