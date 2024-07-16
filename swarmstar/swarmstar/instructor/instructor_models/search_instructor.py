from typing import List
from pydantic import BaseModel, Field

class SearchInstructor(BaseModel):
    questions: List[str] = Field(description="In order to achieve this goal, what questions do we need answered?")
    context: str = Field(description="Context for the node that will perform a search to answer the questions.")
