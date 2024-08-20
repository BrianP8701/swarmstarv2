from data.enums import DatabaseTableEnum
from swarmstar.enums.blocking_operation_enum import BlockingOperationEnum
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.shapes.blocking_args.base_blocking_args import BaseBlockingArgs


class BlockingOperation(BaseOperation):
    table_enum = DatabaseTableEnum.BLOCKING_OPERATIONS

    next_function_to_call: str
    args: BaseBlockingArgs
    blocking_operation_enum: BlockingOperationEnum

    # async def _execute(self) -> List[BaseOperation]:
    #     pass
