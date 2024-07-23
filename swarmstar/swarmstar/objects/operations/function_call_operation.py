from typing import ClassVar, List
from swarmstar.constants.action_constants import ACTION_ENUM_TO_ACTION_NODE_CLASS
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from data.models.swarm_operation_models import FunctionCallOperationModel
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.operations.base_operation import BaseOperation


class FunctionCallOperation(BaseOperation):
    __table__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.FUNCTION_CALL_OPERATIONS
    __object_model__: ClassVar[FunctionCallOperationModel] = FunctionCallOperationModel

    function_to_call: str

    async def _execute(self) -> List[BaseOperation]:
        action_node = await BaseActionNode.read(self.action_node_id)
        ActionNodeClass = ACTION_ENUM_TO_ACTION_NODE_CLASS[action_node.__action_enum__]
        function_to_call = getattr(ActionNodeClass, self.function_to_call)
        return await function_to_call(action_node)
