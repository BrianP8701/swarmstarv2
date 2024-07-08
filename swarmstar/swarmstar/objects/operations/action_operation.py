from typing import ClassVar, Dict, Any
from swarmstar.enums.database_table_enum import DatabaseTable
from swarmstar.models.swarm_operation_models import ActionOperationModel
from swarmstar.objects.operations.base_operation import BaseOperation


class ActionOperation(BaseOperation):
    __table__: ClassVar[DatabaseTable] = DatabaseTable.ACTION_OPERATIONS
    __object_model__: ClassVar[ActionOperationModel] = ActionOperationModel

    function_to_call: str
    args: Dict[str, Any] = {}
