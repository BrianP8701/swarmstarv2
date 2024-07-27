from typing import ClassVar
from data.models.action_metadata_node_model import ActionMetadataNodeModel
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.objects.operations.function_call_operation import FunctionCallOperation
from swarmstar.objects.trees.base_tree import BaseTree


class ActionMetadataTree(BaseTree):
    __table_enum__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.ACTION_METADATA_NODES
    __node_object__: ClassVar[ActionMetadataNode]
    __node_model__: ClassVar[ActionMetadataNodeModel]
    __branch_size_soft_limit__: ClassVar[int]
    __branch_size_hard_limit__: ClassVar[int]
