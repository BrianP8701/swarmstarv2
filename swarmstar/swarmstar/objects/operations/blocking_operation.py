from typing import ClassVar, List
from swarmstar.enums.blocking_operation_enum import BlockingOperationEnum
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from data.models.swarm_operation_models import BlockingOperationModel
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.shapes.blocking_args.base_blocking_args import BaseBlockingArgs

class BlockingOperation(BaseOperation):
    __table_enum__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.BLOCKING_OPERATIONS
    __model_class__: ClassVar[BlockingOperationModel] = BlockingOperationModel

    next_function_to_call: str
    args: BaseBlockingArgs
    blocking_operation_enum: BlockingOperationEnum

    async def _execute(self) -> List[BaseOperation]:
        pass
