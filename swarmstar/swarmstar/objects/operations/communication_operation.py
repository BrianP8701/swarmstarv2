from typing import ClassVar, Dict, Any
from swarmstar.models.swarm_operation_models import CommunicationOperationModel
from swarmstar.objects.operations.base_operation import BaseOperation


class CommunicationOperation(BaseOperation):
    __table__: ClassVar[CommunicationOperationModel] = CommunicationOperationModel

    message: str
    next_function_to_call: str
