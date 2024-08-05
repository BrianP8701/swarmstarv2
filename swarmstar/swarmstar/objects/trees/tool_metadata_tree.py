from typing import ClassVar
from data.models.tool_metadata_node_model import ToolMetadataNodeModel
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.objects.nodes.tool_metadata_node import ToolMetadataNode
from swarmstar.objects.trees.base_tree import BaseTree


class ToolMetadataTree(BaseTree):
    table_enum: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.TOOL_METADATA_NODES
    node_object: ClassVar[ToolMetadataNode]
    node_model: ClassVar[ToolMetadataNodeModel]
    branch_size_soft_limit: ClassVar[int]
    branch_size_hard_limit: ClassVar[int]

    def add(self):
        pass

    def remove(self):
        pass
