from typing import Dict, List

import strawberry

from swarmstar.enums.tool_type_enum import ToolTypeEnum


@strawberry.type
class ActionNode:
    id: str
    title: str
    action_type_enum: str


@strawberry.type
class MemoryMetadataNode:
    id: str
    title: str
    description: str
    memory_type_enum: str


@strawberry.type
class ActionMetadataNode:
    id: str
    title: str
    description: str
    action_type_enum: str


@strawberry.type
class ToolNode:
    id: str
    title: str
    description: str
    tool_type_enum: str


@strawberry.type
class GqlSwarm:
    id: int
    name: str
    goal: str
    memory_id: int
    action_tree: List[ActionNode]
    memory_tree: List[MemoryMetadataNode]


@strawberry.type
class GqlUser:
    id: str
    swarms: List[GqlSwarm] = []
