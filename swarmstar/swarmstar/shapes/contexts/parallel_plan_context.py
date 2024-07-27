from typing import List, Optional
from swarmstar.shapes.contexts.base_context import BaseContext
from swarmstar.objects.message import Message

class ParallelPlanContext(BaseContext):
    attempts: int = 0
    parallel_plan_history: List[List[str]] = []
    parallel_plan_review_feedback_history: List[str] = []

    def get_most_recent_plan_review_feedback(self) -> Optional[str]:
        return self.parallel_plan_review_feedback_history[-1] if self.parallel_plan_review_feedback_history else None

    def get_most_recent_parallel_plan_attempt(self) -> Optional[List[str]]:
        return self.parallel_plan_history[-1] if self.parallel_plan_history else None
