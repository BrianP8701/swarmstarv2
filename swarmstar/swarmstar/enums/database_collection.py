from enum import Enum

class DatabaseCollection(Enum, str):
    SWARM_NODES = "swarm_nodes"
    SWARMSTAR_SPACE = "swarmstar_space"
    ACTION_METADATA_NODES = "action_metadata_nodes"
    MEMORY_METADATA_NODES = "memory_metadata_nodes"
    SWARMSTAR_EVENTS = "swarmstar_events"
    SPAWN_OPERATIONS = "spawn_operations"
    TERMINATION_OPERATIONS = "termination_operations"
    BLOCKING_OPERATIONS = "blocking_operations"
    COMMUNICATION_OPERATIONS = "communication_operations"
    ACTION_OPERATIONS = "action_operations"
