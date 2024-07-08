from typing import Optional
from pydantic import Field
from swarmstar.objects.nodes.base_node import BaseNode

class BaseMetadataNode(BaseNode['BaseMetadataNode']):
    """
    This is the base class for the nodes that make up metadata trees. Metadata trees are data structures that an LLM can navigate.
    """
    is_folder: Optional[bool] = Field(default=None)
    description: str
