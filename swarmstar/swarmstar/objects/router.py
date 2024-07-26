from typing import List, Optional
from swarmstar.instructor.instructors.router_instructor import RouterInstructor

from swarmstar.objects.operations.base_operation import BaseOperation

class Router():
    @classmethod
    async def route(
        cls, 
        options: List[str], 
        content: str, 
        system_message: str, 
        operation: Optional[BaseOperation] = None
    ) -> RouterInstructor:
        return await RouterInstructor.route(
            options=options,
            content=content,
            system_message=system_message,
            operation=operation
        )
