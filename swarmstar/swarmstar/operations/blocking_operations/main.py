from importlib import import_module
from typing import List, Union
import inspect

from swarmstar.objects import (
    BlockingOperation,
    BaseOperation
)


async def blocking(blocking_operation: BlockingOperation) -> Union[BaseOperation, List[BaseOperation]]:
    blocking_operation_type_map = {
        "instructor_completion": "swarmstar.operations.blocking_operations.instructor",
        "openai_completion": "swarmstar.operations.blocking_operations.openai",
        "ask_questions": "swarmstar.operations.blocking_operations.ask_questions"
    }

    blocking_operation_type = blocking_operation.blocking_type

    if blocking_operation_type not in blocking_operation_type_map:
        raise ValueError(
            f"Blocking operation type: `{blocking_operation_type.type}` is not supported."
        )

    blocking_operation_type_module = import_module(
        blocking_operation_type_map[blocking_operation_type]
    )
    
    blocking_func = blocking_operation_type_module.blocking

    if inspect.iscoroutinefunction(blocking_func):
        output: BaseOperation = await blocking_func(blocking_operation)
    else:
        output: BaseOperation = blocking_func(blocking_operation)

    return output
