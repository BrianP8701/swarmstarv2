from typing import ClassVar, List
from swarmstar.enums.blocking_operation_enum import BlockingOperationEnum
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from data.models.operation_models import BlockingOperationModel
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.shapes.blocking_args.base_blocking_args import BaseBlockingArgs

class BlockingOperation(BaseOperation):
    table_enum: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.BLOCKING_OPERATIONS
    database_model_class: ClassVar[BlockingOperationModel] = BlockingOperationModel

    next_function_to_call: str
    args: BaseBlockingArgs
    blocking_operation_enum: BlockingOperationEnum

    # async def _execute(self) -> List[BaseOperation]:
    #     pass
