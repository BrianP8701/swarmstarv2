from __future__ import annotations

from typing import List

from data.enums import DatabaseTableEnum
from swarmstar.objects.operations.base_operation import BaseOperation


class FunctionCallOperation(BaseOperation):
    table_enum = DatabaseTableEnum.FUNCTION_CALL_OPERATIONS
    action_node_id: str
    function_to_call: str

    async def _execute(self) -> List[BaseOperation]:
        from swarmstar.objects.nodes.base_action_node import BaseActionNode

        action_node = await BaseActionNode.read(self.action_node_id)
        function_to_call = getattr(action_node, self.function_to_call)
        return await function_to_call()
