from typing import List
from swarmstar.shapes.contexts.base_context import BaseContext
from swarmstar.objects.message import Message

class ParallelPlanContext(BaseContext):
    conversation: List[Message]
    attempts: int = 0
