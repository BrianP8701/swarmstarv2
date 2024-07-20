from enum import Enum

class ActionEnum(str, Enum):
    FOLDER = 'folder'
    PARALLEL_PLAN = 'parallel_plan'
    SEQUENTIAL_PLAN = 'sequential_plan'
    ROUTE_ACTION = 'route_action'
    CODE = 'code'
    SEARCH = 'search'
    REVIEW_GOAL_PROGRESS = 'review_goal_progress'
