from 

class ActionPlan(BaseModel):
    plan: List[str] = Field(..., description="The plan to be executed. Each element in this list is an action to be pursued immediately, in parallel, without dependencies.")

class ReviewPlan(BaseModel):
    confirmation: bool = Field(..., description="Whether the plan is valid or not.")
    revised_plan: List[str] = Field(None, description="If the plan is not valid, the revised plan to be executed.")