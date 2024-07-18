from enum import Enum

class ActionTypeEnum(str, Enum):
    PLAN = 'plan'
    ROUTE_ACTION = 'route_action'
    CODE = 'code'
    SEARCH = 'search'
    REVIEW_GOAL_PROGRESS = 'review_goal_progress'
