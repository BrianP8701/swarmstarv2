from typing import List, Optional
from swarmstar.actions.contexts.base_context import BaseContext

class QuestionContext(BaseContext):
    __original_operation_id__: str
    __memory_node_id__: Optional[str] = None
    questions: List[str]
    context: Optional[str] = None
