from typing import ClassVar, Dict, Any
from swarmstar.models.swarm_operation_models import SpawnOperationModel
from swarmstar.objects.operations.base_operation import BaseOperation


class SpawnOperation(BaseOperation):
    __table__: ClassVar[SpawnOperationModel] = SpawnOperationModel

    goal: str
    parent_swarm_node_id: str
