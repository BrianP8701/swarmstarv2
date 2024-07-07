from typing import ClassVar, Dict, Any
from swarmstar.swarmstar.models.swarm_operation_models import TerminationOperationModel
from swarmstar.swarmstar.objects.operations.base_operation import BaseOperation


class TerminationOperation(BaseOperation):
    __table__: ClassVar[TerminationOperationModel] = TerminationOperationModel

    terminator_id: str
