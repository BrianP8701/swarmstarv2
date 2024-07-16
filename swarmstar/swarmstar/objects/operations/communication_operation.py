from typing import ClassVar, Dict, Any
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from data.models.swarm_operation_models import CommunicationOperationModel
from swarmstar.objects.base_message import BaseMessage
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.operations.base_operation import BaseOperation


class CommunicationOperation(BaseOperation):
    __table__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.COMMUNICATION_OPERATIONS
    __object_model__: ClassVar[CommunicationOperationModel] = CommunicationOperationModel

    message: BaseMessage
    next_function_to_call: str

    async def _execute(self):
        swarm_node = await SwarmNode.read(self.swarm_node_id)
        pass
        # TODO
