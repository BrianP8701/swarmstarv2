from typing import ClassVar, List, Optional
from swarmstar.constants.action_constants import ACTION_ENUM_TO_ACTION_NODE_CLASS
from swarmstar.enums.action_enum import ActionEnum
from data.models.swarm_operation_models import SpawnOperationModel
from swarmstar.objects.operations.function_call_operation import FunctionCallOperation
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.shapes.contexts.base_context import BaseContext

class SpawnOperation(BaseOperation):
    __table_enum__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.SPAWN_OPERATIONS
    __model_class__: ClassVar[SpawnOperationModel] = SpawnOperationModel

    goal: str
    action_enum: ActionEnum
    context: Optional[str] = None
    node_context: BaseContext

    async def _execute(self) -> List['FunctionCallOperation']:
        ActionNodeClass = ACTION_ENUM_TO_ACTION_NODE_CLASS[self.action_enum]

        new_action_node = ActionNodeClass(
            goal=self.goal,
            context=self.node_context
        )

        return [
            FunctionCallOperation(
                action_node_id=new_action_node.id,
                function_to_call="main"
            )
        ]
