from enum import Enum


class DatabaseTableEnum(str, Enum):
    ACTION_NODES = "action_nodes"
    SWARMSTAR_SPACE = "swarmstar_space"
    SWARMSTAR_EVENTS = "swarmstar_events"
    ACTION_METADATA_NODES = "action_metadata_nodes"
    MEMORY_METADATA_NODES = "memory_metadata_nodes"
    TOOL_METADATA_NODES = "tool_metadata_nodes"
    SPAWN_OPERATIONS = "spawn_operations"
    TERMINATION_OPERATIONS = "termination_operations"
    BLOCKING_OPERATIONS = "blocking_operations"
    COMMUNICATION_OPERATIONS = "communication_operations"
    FUNCTION_CALL_OPERATIONS = "function_call_operations"
    MESSAGES = "messages"
    USERS = "users"