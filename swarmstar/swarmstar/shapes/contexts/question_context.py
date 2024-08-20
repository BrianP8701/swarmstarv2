from typing import List

from swarmstar.shapes.contexts.base_context import BaseContext


class QuestionContext(BaseContext):
    questions: List[str]
