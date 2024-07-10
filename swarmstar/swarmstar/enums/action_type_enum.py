from enum import Enum

class ActionTypeEnum(str, Enum):
    PLAN = 'plan'
    CODE = 'code'
    SEARCH = 'search'
    REVIEW_GOAL_PROGRESS = 'review_goal_progress'
