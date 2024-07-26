from typing import List, Optional
from swarmstar.shapes.contexts.base_context import BaseContext
from swarmstar.objects.message import Message

class SequentialPlanContext(BaseContext):
    goal: str
    conversation: List[Message]
    attempts: int = 0
    sequential_plan_history: List[List[str]] = []
    sequential_plan_review_feedback_history: List[str] = []

    def get_most_recent_plan_review_feedback(self) -> Optional[str]:
        return self.sequential_plan_review_feedback_history[-1] if self.sequential_plan_review_feedback_history else None

    def get_most_recent_sequential_plan_attempt(self) -> Optional[List[str]]:
        return self.sequential_plan_history[-1] if self.sequential_plan_history else None
