from abc import ABC
from typing import List, Optional
from pydantic import BaseModel, Field

class BaseContext(BaseModel, ABC):
    goal: str = Field(
        description="The goal of the node. This is the context that the node is trying to achieve."
    )
    context_history: List[str] = Field(
        description="A list of context strings for the node's task. The most recent context is at the last index, and the list is maintained for observability."
    )
    log_index_key: List[int] = []

    def get_most_recent_context(self) -> Optional[str]:
        return self.context_history[-1] if self.context_history else None
