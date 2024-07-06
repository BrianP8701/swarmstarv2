from typing import Dict, Type, Union
from swarmstar.swarmstar.enums.database_collection import DatabaseCollection

from swarmstar.swarmstar.enums.operation import OperationEnum
from swarmstar.swarmstar.models.swarmstar_event import SwarmstarEventModel
from swarmstar.swarmstar.models.swarm_node import SwarmNodeModel
from swarmstar.swarmstar.models.swarm_operations import SpawnOperationModel, TerminationOperationModel, BlockingOperationModel, CommunicationOperationModel, ActionOperationModel
from swarmstar.swarmstar.models.swarmstar_space import SwarmstarSpaceModel
from swarmstar.swarmstar.objects.swarm.operation_types import SpawnOperation, TerminationOperation, BlockingOperation, CommunicationOperation, ActionOperation

collection_to_identifier: Dict[str, str] = {
    DatabaseCollection.SWARM_NODES: "sn",
    DatabaseCollection.ACTION_METADATA_NODES: "am",
    DatabaseCollection.MEMORY_METADATA_NODES: "mm",
    DatabaseCollection.SWARMSTAR_EVENTS: "se",
    DatabaseCollection.SPAWN_OPERATIONS: "so",
    DatabaseCollection.TERMINATION_OPERATIONS: "to",
    DatabaseCollection.BLOCKING_OPERATIONS: "bo",
    DatabaseCollection.COMMUNICATION_OPERATIONS: "co",
    DatabaseCollection.ACTION_OPERATIONS: "ao"
}

collection_to_swarmstar_space_count_column: Dict[DatabaseCollection, str] = {
    DatabaseCollection.SWARM_NODES: "node_count",
    DatabaseCollection.ACTION_METADATA_NODES: "action_metadata_node_count",
    DatabaseCollection.MEMORY_METADATA_NODES: "memory_metadata_node_count",
    DatabaseCollection.SWARMSTAR_EVENTS: "swarmstar_event_count",
    DatabaseCollection.SPAWN_OPERATIONS: "spawn_operation_count",
    DatabaseCollection.TERMINATION_OPERATIONS: "termination_operation_count",
    DatabaseCollection.BLOCKING_OPERATIONS: "blocking_operation_count",
    DatabaseCollection.COMMUNICATION_OPERATIONS: "communication_operation_count",
    DatabaseCollection.ACTION_OPERATIONS: "action_operation_count"
}

collection_to_model: Dict[DatabaseCollection, Type[SwarmNodeModel]] = {
    DatabaseCollection.SWARM_NODES: SwarmNodeModel,
    # "action_metadata_nodes": ActionMetadataNodeModel,
    # "memory_metadata_nodes": MemoryMetadataNodeModel
}

operation_enum_to_class: Dict[OperationEnum, Type[Union[SpawnOperation, TerminationOperation, BlockingOperation, UserCommunicationOperation, ActionOperation]]] = {
    OperationEnum.SPAWN: SpawnOperation,
    OperationEnum.TERMINATE: TerminationOperation,
    OperationEnum.BLOCKING: BlockingOperation,
    OperationEnum.COMMUNICATION: CommunicationOperation,
    OperationEnum.ACTION: ActionOperation
}

operation_enum_to_model: Dict[OperationEnum, Type[Union[SpawnOperationModel, TerminationOperationModel, BlockingOperationModel, UserCommunicationOperationModel, ActionOperationModel]]] = {
    OperationEnum.SPAWN: SpawnOperationModel,
    OperationEnum.TERMINATE: TerminationOperationModel,
    OperationEnum.BLOCKING: BlockingOperationModel,
    OperationEnum.COMMUNICATION: CommunicationOperationModel,
    OperationEnum.ACTION: ActionOperationModel
}

all_models = [
    SwarmNodeModel, 
    SwarmstarEventModel, 
    SwarmstarSpaceModel, 
    SpawnOperationModel, 
    TerminationOperationModel, 
    BlockingOperationModel, 
    CommunicationOperationModel, 
    ActionOperationModel
]
