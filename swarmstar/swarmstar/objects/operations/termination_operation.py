from typing import ClassVar, Dict, Any
from swarmstar.models.swarm_operation_models import TerminationOperationModel
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.enums.database_table_enum import DatabaseTable


class TerminationOperation(BaseOperation):
    __table__: ClassVar[DatabaseTable] = DatabaseTable.TERMINATION_OPERATIONS
    __object_model__: ClassVar[TerminationOperationModel] = TerminationOperationModel

    terminator_id: str
