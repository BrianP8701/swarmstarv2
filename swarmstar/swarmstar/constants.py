from typing import Dict, List, Type
from swarmstar.swarmstar.enums.database_table import DatabaseTable

from swarmstar.swarmstar.models.swarmstar_event_model import SwarmstarEventModel
from swarmstar.swarmstar.models.swarm_node_model import SwarmNodeModel
from swarmstar.swarmstar.models.swarm_operation_models import SpawnOperationModel, TerminationOperationModel, BlockingOperationModel, CommunicationOperationModel, ActionOperationModel
from swarmstar.swarmstar.models.swarmstar_space_model import SwarmstarSpaceModel

TABLE_ENUM_TO_ABBREVIATION: Dict[DatabaseTable, str] = {
    DatabaseTable.SWARM_NODES: "sn",
    DatabaseTable.ACTION_METADATA_NODES: "am",
    DatabaseTable.MEMORY_METADATA_NODES: "mm",
    DatabaseTable.SWARMSTAR_EVENTS: "se",
    DatabaseTable.SPAWN_OPERATIONS: "so",
    DatabaseTable.TERMINATION_OPERATIONS: "to",
    DatabaseTable.BLOCKING_OPERATIONS: "bo",
    DatabaseTable.COMMUNICATION_OPERATIONS: "co",
    DatabaseTable.ACTION_OPERATIONS: "ao"
}

TABLE_ABBREVIATION_TO_ENUM: Dict[str, DatabaseTable] = {
    "sn": DatabaseTable.SWARM_NODES,
    "am": DatabaseTable.ACTION_METADATA_NODES,
    "mm": DatabaseTable.MEMORY_METADATA_NODES,
    "se": DatabaseTable.SWARMSTAR_EVENTS,
    "so": DatabaseTable.SPAWN_OPERATIONS,
    "to": DatabaseTable.TERMINATION_OPERATIONS,
    "bo": DatabaseTable.BLOCKING_OPERATIONS,
    "co": DatabaseTable.COMMUNICATION_OPERATIONS,
    "ao": DatabaseTable.ACTION_OPERATIONS
}

TABLE_ENUM_TO_SWARMSTAR_SPACE_COUNT_COLUMN: Dict[DatabaseTable, str] = {
    DatabaseTable.SWARM_NODES: "node_count",
    DatabaseTable.ACTION_METADATA_NODES: "action_metadata_node_count",
    DatabaseTable.MEMORY_METADATA_NODES: "memory_metadata_node_count",
    DatabaseTable.SWARMSTAR_EVENTS: "swarmstar_event_count",
    DatabaseTable.SPAWN_OPERATIONS: "spawn_operation_count",
    DatabaseTable.TERMINATION_OPERATIONS: "termination_operation_count",
    DatabaseTable.BLOCKING_OPERATIONS: "blocking_operation_count",
    DatabaseTable.COMMUNICATION_OPERATIONS: "communication_operation_count",
    DatabaseTable.ACTION_OPERATIONS: "action_operation_count"
}

TABLE_ENUMS_TO_LISTEN_TO: List[DatabaseTable] = [
    DatabaseTable.SWARM_NODES,
    DatabaseTable.ACTION_METADATA_NODES,
    DatabaseTable.MEMORY_METADATA_NODES,
    DatabaseTable.SWARMSTAR_EVENTS,
    DatabaseTable.SPAWN_OPERATIONS,
    DatabaseTable.TERMINATION_OPERATIONS,
    DatabaseTable.BLOCKING_OPERATIONS,
    DatabaseTable.COMMUNICATION_OPERATIONS,
    DatabaseTable.ACTION_OPERATIONS
]

TABLE_ENUM_TO_MODEL_CLASS: Dict[DatabaseTable, Type[SwarmNodeModel]] = {
    DatabaseTable.SWARM_NODES: SwarmNodeModel,
    # DatabaseTable.ACTION_METADATA_NODES: ActionMetadataNodeModel,
    # DatabaseTable.MEMORY_METADATA_NODES: MemoryMetadataNodeModel,
    DatabaseTable.SWARMSTAR_EVENTS: SwarmstarEventModel,
    DatabaseTable.SPAWN_OPERATIONS: SpawnOperationModel,
    DatabaseTable.TERMINATION_OPERATIONS: TerminationOperationModel,
    DatabaseTable.BLOCKING_OPERATIONS: BlockingOperationModel,
    DatabaseTable.COMMUNICATION_OPERATIONS: CommunicationOperationModel,
    DatabaseTable.ACTION_OPERATIONS: ActionOperationModel
}

TABLE_ENUM_TO_TABLE_NAME: Dict[DatabaseTable, str] = {
    DatabaseTable.SWARM_NODES: "swarm_nodes",
    DatabaseTable.ACTION_METADATA_NODES: "action_metadata_nodes",
    DatabaseTable.MEMORY_METADATA_NODES: "memory_metadata_nodes",
    DatabaseTable.SWARMSTAR_EVENTS: "swarmstar_events",
    DatabaseTable.SPAWN_OPERATIONS: "spawn_operations",
    DatabaseTable.TERMINATION_OPERATIONS: "termination_operations",
    DatabaseTable.BLOCKING_OPERATIONS: "blocking_operations",
    DatabaseTable.COMMUNICATION_OPERATIONS: "communication_operations",
    DatabaseTable.ACTION_OPERATIONS: "action_operations"
}

ALL_DATABASE_MODEL_CLASSES = [
    SwarmNodeModel, 
    SwarmstarEventModel, 
    SwarmstarSpaceModel, 
    SpawnOperationModel, 
    TerminationOperationModel, 
    BlockingOperationModel, 
    CommunicationOperationModel, 
    ActionOperationModel
]

SWARM_ID_LENGTH = 32
