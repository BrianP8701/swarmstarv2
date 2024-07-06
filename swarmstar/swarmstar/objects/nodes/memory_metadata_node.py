"""
Memory metadata labels data with descriptions.

It also marks each with a type. Different types of data have specialized
tools in swarmstar/actions/memory_tools
"""
from typing import  List, Optional, TypeVar, Type, ClassVar
from pydantic import Field
from typing_extensions import Literal

from swarmstar.objects.metadata.memory_types import MemoryType
from swarmstar.swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode
from swarmstar.utils.misc.ids import generate_id

T = TypeVar('T', bound='MemoryMetadata')

class MemoryMetadataNode(BaseMetadataNode):
    __table__: ClassVar[str] = "memory_metadata"
    id: Optional[str] = Field(default_factory=lambda: generate_id("memory_metadata"))
    type: MemoryType # These define the type of the underlying data. Each type has tools to better navigate the data

    @classmethod
    def get(cls: Type[T], memory_id: str) -> T:
        """ Retrieve a memory metadata node from the database and return an instance of the correct class. """
        # First, call the superclass (MetadataNode) get method to retrieve the node
        memory_metadata_dict = super().get_node_dict(memory_id)
        
        if memory_metadata_dict["internal"]:
            if memory_metadata_dict["is_folder"]:
                return InternalMemoryFolderMetadata(**memory_metadata_dict)
            else:
                return InternalMemoryMetadata(**memory_metadata_dict)
        else:
            if memory_metadata_dict["is_folder"]:
                return ExternalMemoryFolderMetadata(**memory_metadata_dict)
            else:
                return ExternalMemoryMetadata(**memory_metadata_dict)

class InternalMemoryMetadata(MemoryMetadataNode):
    is_folder: Literal[False] = Field(default=False)
    internal: Literal[True] = Field(default=True)
    children_ids: Optional[List[str]] = Field(default=None)
    parent_id: str

class InternalMemoryFolderMetadata(MemoryMetadataNode):
    is_folder: Literal[True] = Field(default=True)
    internal: Literal[True] = Field(default=True)
    children_ids: List[str]

class ExternalMemoryMetadata(MemoryMetadataNode):
    is_folder: Literal[False] = Field(default=False)
    internal: Literal[False] = Field(default=False)
    children_ids: Optional[List[str]] = Field(default=None)
    parent_id: str

class ExternalMemoryFolderMetadata(MemoryMetadataNode):
    is_folder: Literal[True] = Field(default=True)
    internal: Literal[False] = Field(default=False)
    children_ids: List[str]
