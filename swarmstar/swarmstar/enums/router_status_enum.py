from enum import Enum


class RouterStatusEnum(str, Enum):
    SEARCHING = "SEARCHING"
    NO_VIABLE_OPTIONS = "NO_VIABLE_OPTIONS"
    NO_CHILDREN = "NO_CHILDREN"
    SUCCESS = "SUCCESS"
    FAILURE = "FAILURE"
