from typing import ClassVar, Dict, Any
from swarmstar.enums.database_table_enum import DatabaseTable
from swarmstar.models.swarm_operation_models import CommunicationOperationModel
from swarmstar.objects.operations.base_operation import BaseOperation


class CommunicationOperation(BaseOperation):
    __table__: ClassVar[DatabaseTable] = DatabaseTable.COMMUNICATION_OPERATIONS
    __object_model__: ClassVar[CommunicationOperationModel] = CommunicationOperationModel

    message: str
    next_function_to_call: str
