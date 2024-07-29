from typing import List
from data.models.action_node_model import ActionNodeModel
from swarmstar.enums.database_table_enum import DatabaseTableEnum

from data.models.message import MessageModel
from data.models.action_metadata_node_model import ActionMetadataNodeModel
from data.models.memory_metadata_node_model import MemoryMetadataNodeModel
from data.models.swarmstar_event_model import SwarmstarEventModel
from data.models.swarm_operation_models import SpawnOperationModel, TerminationOperationModel, FunctionCallOperationModel
from data.models.swarmstar_space_model import SwarmstarSpaceModel
from data.models.tool_metadata_node_model import ToolMetadataNodeModel

from swarmstar.objects.message import Message
from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.nodes.memory_metadata_node import MemoryMetadataNode
from swarmstar.objects.nodes.tool_metadata_node import ToolMetadataNode
from swarmstar.objects.operations.function_call_operation import FunctionCallOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation
from swarmstar.objects.operations.termination_operation import TerminationOperation

TABLE_PROPERTIES = {
    DatabaseTableEnum.ACTION_METADATA_NODES: {
        "abbreviation": "am",
        "count_column": "action_metadata_node_count",
        "model_class": ActionMetadataNodeModel,
        "table_name": "action_metadata_nodes",
        "object_class": ActionMetadataNode
    },
    DatabaseTableEnum.MEMORY_METADATA_NODES: {
        "abbreviation": "mm",
        "count_column": "memory_metadata_node_count",
        "model_class": MemoryMetadataNodeModel,
        "table_name": "memory_metadata_nodes",
        "object_class": MemoryMetadataNode
    },
    DatabaseTableEnum.SWARMSTAR_EVENTS: {
        "abbreviation": "se",
        "count_column": "swarmstar_event_count",
        "model_class": SwarmstarEventModel,
        "table_name": "swarmstar_events",
        "object_class": None
    },
    DatabaseTableEnum.SPAWN_OPERATIONS: {
        "abbreviation": "so",
        "count_column": "spawn_operation_count",
        "model_class": SpawnOperationModel,
        "table_name": "spawn_operations",
        "object_class": SpawnOperation
    },
    DatabaseTableEnum.TERMINATION_OPERATIONS: {
        "abbreviation": "to",
        "count_column": "termination_operation_count",
        "model_class": TerminationOperationModel,
        "table_name": "termination_operations",
        "object_class": TerminationOperation
    },
    DatabaseTableEnum.FUNCTION_CALL_OPERATIONS: {
        "abbreviation": "fco",
        "count_column": "function_call_operation_count",
        "model_class": FunctionCallOperationModel,
        "table_name": "function_call_operations",
        "object_class": FunctionCallOperation
    },
    DatabaseTableEnum.TOOL_METADATA_NODES: {
        "abbreviation": "tm",
        "count_column": "tool_metadata_node_count",
        "model_class": ToolMetadataNodeModel,
        "table_name": "tool_metadata_nodes",
        "object_class": ToolMetadataNode
    },
    DatabaseTableEnum.MESSAGES: {
        "abbreviation": "ms",
        "count_column": "message_count",
        "model_class": MessageModel,
        "table_name": "messages",
        "object_class": Message
    },
    DatabaseTableEnum.ACTION_NODES: {
        "abbreviation": "an",
        "count_column": "action_node_count",
        "model_class": ActionNodeModel,
        "table_name": "action_nodes",
        "object_class": BaseActionNode
    }
}

TABLE_ENUM_TO_ABBREVIATION = {k: v["abbreviation"] for k, v in TABLE_PROPERTIES.items()}
TABLE_ABBREVIATION_TO_ENUM = {v["abbreviation"]: k for k, v in TABLE_PROPERTIES.items()}
TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN = {k: v["count_column"] for k, v in TABLE_PROPERTIES.items()}
TABLE_ENUM_TO_MODEL_CLASS = {k: v["model_class"] for k, v in TABLE_PROPERTIES.items() if "model_class" in v}
TABLE_ENUM_TO_TABLE_NAME = {k: v["table_name"] for k, v in TABLE_PROPERTIES.items()}
TABLE_ENUM_TO_OBJECT_CLASS = {k: v["object_class"] for k, v in TABLE_PROPERTIES.items() if "object_class" in v}

TABLE_ENUMS_TO_LISTEN_TO: List[DatabaseTableEnum] = list(TABLE_PROPERTIES.keys())

ALL_DATABASE_MODEL_CLASSES = [
    SwarmstarEventModel, 
    SwarmstarSpaceModel, 
    SpawnOperationModel, 
    TerminationOperationModel, 
    FunctionCallOperationModel,
    ActionMetadataNodeModel,
    MemoryMetadataNodeModel,
    ToolMetadataNodeModel,
    MessageModel
]
