from typing import Dict, Type, Union

from swarmstar.swarmstar.enums.operations import OperationEnum
from swarmstar.swarmstar.models.swarm_node import SwarmNodeModel
from swarmstar.swarmstar.models.swarm_operations import SpawnOperationModel, TerminationOperationModel, BlockingOperationModel, UserCommunicationOperationModel, ActionOperationModel
from swarmstar.swarmstar.types.swarm.operation_types import SpawnOperation, TerminationOperation, BlockingOperation, UserCommunicationOperation, ActionOperation

collection_to_identifier: Dict[str, str] = {
    "swarm_nodes": "s",
    "action_metadata_nodes": "a",
    "memory_metadata_nodes": "m"
}

collection_to_model: Dict[str, Type[SwarmNodeModel]] = {
    "swarm_nodes": SwarmNodeModel,
    # "action_metadata_nodes": ActionMetadataNodeModel,
    # "memory_metadata_nodes": MemoryMetadataNodeModel
}

operation_enum_to_class: Dict[OperationEnum, Type[Union[SpawnOperation, TerminationOperation, BlockingOperation, UserCommunicationOperation, ActionOperation]]] = {
    OperationEnum.SPAWN: SpawnOperation,
    OperationEnum.TERMINATE: TerminationOperation,
    OperationEnum.BLOCKING: BlockingOperation,
    OperationEnum.USER_COMMUNICATION: UserCommunicationOperation,
    OperationEnum.ACTION: ActionOperation
}

operation_enum_to_model: Dict[OperationEnum, Type[Union[SpawnOperationModel, TerminationOperationModel, BlockingOperationModel, UserCommunicationOperationModel, ActionOperationModel]]] = {
    OperationEnum.SPAWN: SpawnOperationModel,
    OperationEnum.TERMINATE: TerminationOperationModel,
    OperationEnum.BLOCKING: BlockingOperationModel,
    OperationEnum.USER_COMMUNICATION: UserCommunicationOperationModel,
    OperationEnum.ACTION: ActionOperationModel
}