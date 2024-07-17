from typing import ClassVar, Dict, Any, List
from swarmstar.constants.action_constants import ACTION_ENUM_TO_ACTION_CLASS
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from data.models.swarm_operation_models import ActionOperationModel
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.operations.base_operation import BaseOperation


class ActionOperation(BaseOperation):
    __table__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.ACTION_OPERATIONS
    __object_model__: ClassVar[ActionOperationModel] = ActionOperationModel

    function_to_call: str

    async def _execute(self) -> List[BaseOperation]:
        swarm_node = await SwarmNode.read(self.swarm_node_id)
        action_class = ACTION_ENUM_TO_ACTION_CLASS[swarm_node.action_type]
        function_to_call = getattr(action_class, self.function_to_call)
        return await function_to_call(swarm_node)
