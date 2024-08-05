from __future__ import annotations
from typing import ClassVar, List
from swarmstar.enums.action_enum import ActionEnum
from data.models.operation_models import SpawnOperationModel
from swarmstar.objects.operations.function_call_operation import FunctionCallOperation
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.shapes.contexts.base_context import BaseContext

class SpawnOperation(BaseOperation):
    table_enum: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.SPAWN_OPERATIONS
    database_model_class: ClassVar[SpawnOperationModel] = SpawnOperationModel

    goal: str
    action_enum: ActionEnum
    context: BaseContext

    async def _execute(self) -> List['FunctionCallOperation']:
        from swarmstar.constants.action_constants import ACTION_ENUM_TO_ACTION_NODE_CLASS
        ActionNodeClass = ACTION_ENUM_TO_ACTION_NODE_CLASS[self.action_enum]

        new_action_node = ActionNodeClass(
            goal=self.goal,
            context=self.context
        )

        return [
            FunctionCallOperation(
                action_node_id=new_action_node.id,
                function_to_call="main"
            )
        ]
