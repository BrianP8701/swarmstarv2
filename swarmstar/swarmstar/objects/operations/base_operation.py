from typing import List, Optional
from abc import ABC, abstractmethod

from swarmstar.objects.base_object import BaseObject
from swarmstar.shapes.contexts.base_context import BaseContext
from swarmstar.utils.misc.ids import get_operation_class_from_id

class BaseOperation(BaseObject, ABC):
    action_node_id: str
    context: BaseContext
    
    @staticmethod
    async def execute(operation_id: str) -> List[str]:
        """ 
        This is the base class for spawn, action, termination, and communication operations. 
        Just pass in an operation id, and this function will will route to the correct class and execute the operation.
        """
        operation_class = get_operation_class_from_id(operation_id)
        operation = await operation_class.read(operation_id)
        new_operations = await operation._execute()
        return [new_operation.id for new_operation in new_operations]

    @abstractmethod
    async def _execute(self) -> List['BaseOperation']:
        pass
