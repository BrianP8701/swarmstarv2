from typing import Type, ClassVar

from swarmstar.enums.tool_type_enum import ToolTypeEnum
from data.models.tool_metadata_node_model import ToolMetadataNodeModel
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode

class ToolMetadataNode(BaseMetadataNode['ToolMetadataNode']):
    table_enum: ClassVar[str] = "tool_metadata_nodes"
    database_model_class: ClassVar[Type['ToolMetadataNodeModel']] = ToolMetadataNodeModel

    tool_type: ToolTypeEnum
