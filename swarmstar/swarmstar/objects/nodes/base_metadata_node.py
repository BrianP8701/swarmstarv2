from abc import ABC
from typing import Optional, TypeVar, Generic
from pydantic import Field
from swarmstar.objects.nodes.base_node import BaseNode

T = TypeVar('T', bound='BaseMetadataNode')

class BaseMetadataNode(BaseNode['BaseMetadataNode'], Generic[T], ABC):
    """
    This is the base class for the nodes that make up metadata trees. Metadata trees are data structures that an LLM can navigate.
    """
    is_folder: Optional[bool] = Field(default=None)
    description: str
