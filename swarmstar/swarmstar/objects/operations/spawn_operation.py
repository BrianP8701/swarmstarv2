from typing import ClassVar, List
from swarmstar.constants.action_constants import ACTION_ENUM_TO_ACTION_NODE_CLASS
from swarmstar.enums.action_enum import ActionEnum
from data.models.swarm_operation_models import SpawnOperationModel
from swarmstar.objects.operations.function_call_operation import FunctionCallOperation
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.enums.database_table_enum import DatabaseTableEnum

class SpawnOperation(BaseOperation):
    __table__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.SPAWN_OPERATIONS
    __object_model__: ClassVar[SpawnOperationModel] = SpawnOperationModel

    goal: str
    action_enum: ActionEnum

    async def _execute(self) -> List['FunctionCallOperation']:
        ActionNodeClass = ACTION_ENUM_TO_ACTION_NODE_CLASS[self.action_enum]

        new_node = ActionNodeClass(
            goal= self.goal,
            context=ActionNodeClass.__node_context_class__(),
            operation=self
        )

        return [
            FunctionCallOperation(
                action_node_id=new_node.id,
                function_to_call="main",
                context=ActionNodeClass.__node_context_class__(**self.context.model_dump() if self.context else {})
            )
        ]
