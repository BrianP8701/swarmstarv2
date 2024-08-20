from data.enums import DatabaseTableEnum
from swarmstar.enums.tool_type_enum import ToolTypeEnum
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode


class ToolMetadataNode(BaseMetadataNode["ToolMetadataNode"]):
    table_enum = DatabaseTableEnum.TOOL_METADATA_NODES

    tool_type: ToolTypeEnum
