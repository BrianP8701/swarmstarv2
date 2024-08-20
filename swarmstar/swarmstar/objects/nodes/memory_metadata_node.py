"""
Memory metadata labels data with descriptions.

It also marks each with a type. Different types of data have specialized
tools in swarmstar/actions/memory_tools
"""
from data.enums import DatabaseTableEnum
from swarmstar.enums.memory_type_enum import MemoryTypeEnum
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode


class MemoryMetadataNode(BaseMetadataNode["MemoryMetadataNode"]):
    table_enum = DatabaseTableEnum.MEMORY_METADATA_NODES

    memory_type: MemoryTypeEnum  # These define the type of the underlying data. Each type has tools to better navigate the data

    def get_memory(self):
        ...
