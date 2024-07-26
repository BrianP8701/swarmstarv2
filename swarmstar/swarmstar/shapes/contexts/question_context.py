from typing import List, Optional
from swarmstar.shapes.contexts.base_context import BaseContext

class QuestionContext(BaseContext):
    questions: List[str]
