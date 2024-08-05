from data.models.swarmstar_event_model import SwarmstarEventModel
from data.models.swarmstar_space_model import SwarmstarSpaceModel
from data.models.operation_models import SpawnOperationModel, TerminationOperationModel, FunctionCallOperationModel
from data.models.action_metadata_node_model import ActionMetadataNodeModel
from data.models.memory_metadata_node_model import MemoryMetadataNodeModel
from data.models.tool_metadata_node_model import ToolMetadataNodeModel
from data.models.message_model import MessageModel
from data.models.action_node_model import ActionNodeModel

ALL_DATABASE_MODEL_CLASSES = [
    SwarmstarEventModel, 
    SwarmstarSpaceModel, 
    SpawnOperationModel, 
    TerminationOperationModel, 
    FunctionCallOperationModel,
    ActionMetadataNodeModel,
    MemoryMetadataNodeModel,
    ToolMetadataNodeModel,
    MessageModel,
    ActionNodeModel
]
