from typing import Type, ClassVar

from swarmstar.enums.tool_type_enum import ToolTypeEnum
from swarmstar.models.tool_metadata_node_model import ToolMetadataNodeModel
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode

class ToolMetadataNode(BaseMetadataNode['ToolMetadataNode']):
    __table__: ClassVar[str] = "tool_metadata_nodes"
    __object_model__: ClassVar[Type['ToolMetadataNodeModel']] = ToolMetadataNodeModel

    tool_type: ToolTypeEnum
