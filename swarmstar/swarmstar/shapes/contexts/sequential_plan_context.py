from typing import List
from swarmstar.shapes.contexts.base_context import BaseContext
from swarmstar.objects.message import Message

class SequentialPlanContext(BaseContext):
    goal: str
    conversation: List[Message]
    attempts: int = 0
