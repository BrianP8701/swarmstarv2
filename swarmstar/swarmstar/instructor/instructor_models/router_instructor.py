from pydantic import BaseModel, Field
from typing import List

class RouterInstructor(BaseModel):
    best_option: int = Field(description="The index of the best option. 0 if there is no viable option.")
    unviable_options: List[int] = Field(description="The indices of the options that are unviable")
