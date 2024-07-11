from typing import Dict, List, Type
from pydantic import BaseModel
from swarmstar.actions.general.plan import Plan
from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.instructor.instructor_models.router_instructor_model import RouterInstructorModel
from swarmstar.models.action_metadata_node_model import ActionMetadataNodeModel
from swarmstar.models.memory_metadata_node_model import MemoryMetadataNodeModel

from swarmstar.models.swarmstar_event_model import SwarmstarEventModel
from swarmstar.models.swarm_node_model import SwarmNodeModel
from swarmstar.models.swarm_operation_models import SpawnOperationModel, TerminationOperationModel, CommunicationOperationModel, ActionOperationModel
from swarmstar.models.swarmstar_space_model import SwarmstarSpaceModel
from swarmstar.models.tool_metadata_node_model import ToolMetadataNodeModel
from swarmstar.objects.base_action import BaseAction
from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.objects.nodes.memory_metadata_node import MemoryMetadataNode
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.nodes.tool_metadata_node import ToolMetadataNode
from swarmstar.objects.operations.action_operation import ActionOperation
from swarmstar.objects.operations.communication_operation import CommunicationOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation
from swarmstar.objects.operations.termination_operation import TerminationOperation

TABLE_PROPERTIES = {
    DatabaseTableEnum.SWARM_NODES: {
        "abbreviation": "sn",
        "count_column": "node_count",
        "model_class": SwarmNodeModel,
        "table_name": "swarm_nodes",
        "object_class": SwarmNode
    },
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
    DatabaseTableEnum.COMMUNICATION_OPERATIONS: {
        "abbreviation": "co",
        "count_column": "communication_operation_count",
        "model_class": CommunicationOperationModel,
        "table_name": "communication_operations",
        "object_class": CommunicationOperation
    },
    DatabaseTableEnum.ACTION_OPERATIONS: {
        "abbreviation": "ao",
        "count_column": "action_operation_count",
        "model_class": ActionOperationModel,
        "table_name": "action_operations",
        "object_class": ActionOperation
    },
    DatabaseTableEnum.TOOL_METADATA_NODES: {
        "abbreviation": "tm",
        "count_column": "tool_metadata_node_count",
        "model_class": ToolMetadataNodeModel,
        "table_name": "tool_metadata_nodes",
        "object_class": ToolMetadataNode
    }
}

# Generate the required dictionaries from the single source of truth
TABLE_ENUM_TO_ABBREVIATION = {k: v["abbreviation"] for k, v in TABLE_PROPERTIES.items()}
TABLE_ABBREVIATION_TO_ENUM = {v["abbreviation"]: k for k, v in TABLE_PROPERTIES.items()}
TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN = {k: v["count_column"] for k, v in TABLE_PROPERTIES.items()}
TABLE_ENUM_TO_MODEL_CLASS = {k: v["model_class"] for k, v in TABLE_PROPERTIES.items() if "model_class" in v}
TABLE_ENUM_TO_TABLE_NAME = {k: v["table_name"] for k, v in TABLE_PROPERTIES.items()}
TABLE_ENUM_TO_OBJECT_CLASS = {k: v["object_class"] for k, v in TABLE_PROPERTIES.items() if "object_class" in v}

TABLE_ENUMS_TO_LISTEN_TO: List[DatabaseTableEnum] = list(TABLE_PROPERTIES.keys())

ALL_DATABASE_MODEL_CLASSES = [
    SwarmNodeModel, 
    SwarmstarEventModel, 
    SwarmstarSpaceModel, 
    SpawnOperationModel, 
    TerminationOperationModel, 
    CommunicationOperationModel, 
    ActionOperationModel
]

SWARM_ID_LENGTH = 32

ACTION_ENUM_TO_ACTION_CLASS: Dict[ActionTypeEnum, Type[BaseAction]] = {
    ActionTypeEnum.PLAN: Plan
}

INSTRUCTOR_MODEL_TITLE_TO_CLASS: Dict[str, Type[BaseModel]] = {
    "Router": RouterInstructorModel
}