from typing import Any, ClassVar, Dict, List
from swarmstar.enums.action_enum import ActionEnum
from data.models.swarm_operation_models import SpawnOperationModel
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.operations.action_operation import ActionOperation
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.utils.misc.strings import enum_to_string


class SpawnOperation(BaseOperation):
    __table__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.SPAWN_OPERATIONS
    __object_model__: ClassVar[SpawnOperationModel] = SpawnOperationModel

    goal: str
    action_enum: ActionEnum

    async def _execute(self) -> List['ActionOperation']:
        new_node = SwarmNode(
            title=enum_to_string(self.action_enum),
            parent_id=self.swarm_node_id,
            action_enum=self.action_enum,
            goal=self.goal,
        )

        return [
            ActionOperation(
                function_to_call="start",
                swarm_node_id=new_node.id,
            )
        ]
