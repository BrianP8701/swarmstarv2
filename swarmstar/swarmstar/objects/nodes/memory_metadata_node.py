"""
Memory metadata labels data with descriptions.

It also marks each with a type. Different types of data have specialized
tools in swarmstar/actions/memory_tools
"""
from typing import Type, ClassVar

from swarmstar.enums.memory_type_enum import MemoryTypeEnum
from data.models.memory_metadata_node_model import MemoryMetadataNodeModel
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode

class MemoryMetadataNode(BaseMetadataNode['MemoryMetadataNode']):
    __table__: ClassVar[str] = "memory_metadata"
    __object_model__: ClassVar[Type['MemoryMetadataNodeModel']] = MemoryMetadataNodeModel
    
    memory_type: MemoryTypeEnum # These define the type of the underlying data. Each type has tools to better navigate the data

    def get_memory(self):
        ...
