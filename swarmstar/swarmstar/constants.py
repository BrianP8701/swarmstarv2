from typing import Dict, List, Type
from swarmstar.enums.database_table_enum import DatabaseTable

from swarmstar.models.swarmstar_event_model import SwarmstarEventModel
from swarmstar.models.swarm_node_model import SwarmNodeModel
from swarmstar.models.swarm_operation_models import SpawnOperationModel, TerminationOperationModel, CommunicationOperationModel, ActionOperationModel
from swarmstar.models.swarmstar_space_model import SwarmstarSpaceModel

TABLE_PROPERTIES = {
    DatabaseTable.SWARM_NODES: {
        "abbreviation": "sn",
        "count_column": "node_count",
        "model_class": SwarmNodeModel,
        "table_name": "swarm_nodes"
    },
    DatabaseTable.ACTION_METADATA_NODES: {
        "abbreviation": "am",
        "count_column": "action_metadata_node_count",
        # "model_class": ActionMetadataNodeModel,
        "table_name": "action_metadata_nodes"
    },
    DatabaseTable.MEMORY_METADATA_NODES: {
        "abbreviation": "mm",
        "count_column": "memory_metadata_node_count",
        # "model_class": MemoryMetadataNodeModel,
        "table_name": "memory_metadata_nodes"
    },
    DatabaseTable.SWARMSTAR_EVENTS: {
        "abbreviation": "se",
        "count_column": "swarmstar_event_count",
        "model_class": SwarmstarEventModel,
        "table_name": "swarmstar_events"
    },
    DatabaseTable.SPAWN_OPERATIONS: {
        "abbreviation": "so",
        "count_column": "spawn_operation_count",
        "model_class": SpawnOperationModel,
        "table_name": "spawn_operations"
    },
    DatabaseTable.TERMINATION_OPERATIONS: {
        "abbreviation": "to",
        "count_column": "termination_operation_count",
        "model_class": TerminationOperationModel,
        "table_name": "termination_operations"
    },
    DatabaseTable.COMMUNICATION_OPERATIONS: {
        "abbreviation": "co",
        "count_column": "communication_operation_count",
        "model_class": CommunicationOperationModel,
        "table_name": "communication_operations"
    },
    DatabaseTable.ACTION_OPERATIONS: {
        "abbreviation": "ao",
        "count_column": "action_operation_count",
        "model_class": ActionOperationModel,
        "table_name": "action_operations"
    }
}

# Generate the required dictionaries from the single source of truth
TABLE_ENUM_TO_ABBREVIATION = {k: v["abbreviation"] for k, v in TABLE_PROPERTIES.items()}
TABLE_ABBREVIATION_TO_ENUM = {v["abbreviation"]: k for k, v in TABLE_PROPERTIES.items()}
TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN = {k: v["count_column"] for k, v in TABLE_PROPERTIES.items()}
TABLE_ENUM_TO_MODEL_CLASS = {k: v["model_class"] for k, v in TABLE_PROPERTIES.items() if "model_class" in v}
TABLE_ENUM_TO_TABLE_NAME = {k: v["table_name"] for k, v in TABLE_PROPERTIES.items()}

TABLE_ENUMS_TO_LISTEN_TO: List[DatabaseTable] = list(TABLE_PROPERTIES.keys())

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
