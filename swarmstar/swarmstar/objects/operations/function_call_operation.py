from __future__ import annotations
from typing import ClassVar, List
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from data.models.operation_models import FunctionCallOperationModel
from swarmstar.objects.operations.base_operation import BaseOperation

class FunctionCallOperation(BaseOperation):
    table_enum: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.FUNCTION_CALL_OPERATIONS
    database_model_class: ClassVar[FunctionCallOperationModel] = FunctionCallOperationModel

    function_to_call: str

    async def _execute(self) -> List[BaseOperation]:
        from swarmstar.objects.nodes.base_action_node import BaseActionNode
        action_node = await BaseActionNode.read(self.action_node_id)
        function_to_call = getattr(action_node, self.function_to_call)
        return await function_to_call()
