from typing import ClassVar
from data.models.tool_metadata_node_model import ToolMetadataNodeModel
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.objects.nodes.tool_metadata_node import ToolMetadataNode
from swarmstar.objects.trees.base_metadata_tree import BaseMetadataTree


class ToolMetadataTree(BaseMetadataTree):
    __table_enum__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.TOOL_METADATA_NODES
    __node_object__: ClassVar[ToolMetadataNode]
    __node_model__: ClassVar[ToolMetadataNodeModel]
    __branch_size_soft_limit__: ClassVar[int]
    __branch_size_hard_limit__: ClassVar[int]

    def add(self):
        pass

    def remove(self):
        pass
