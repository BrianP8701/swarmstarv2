from typing import ClassVar, Dict, Any
from swarmstar.models.swarm_operation_models import SpawnOperationModel
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.enums.database_table_enum import DatabaseTable


class SpawnOperation(BaseOperation):
    __table__: ClassVar[DatabaseTable] = DatabaseTable.SPAWN_OPERATIONS
    __object_model__: ClassVar[SpawnOperationModel] = SpawnOperationModel

    goal: str
    parent_swarm_node_id: str
