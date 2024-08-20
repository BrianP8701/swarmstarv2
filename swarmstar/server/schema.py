from typing import List, Dict
from server.services.StripeService import StripeService
import strawberry
from dotenv import load_dotenv
from swarmstar.objects.swarmstar_space import SwarmstarSpace

from swarmstar.objects.user import User
from swarmstar.enums.tool_type_enum import ToolTypeEnum
from swarmstar.objects.trees.memory_metadata_tree import MemoryMetadataTree
from swarmstar.objects.trees.action_metadata_tree import ActionMetadataTree
from swarmstar.objects.trees.tool_metadata_tree import ToolMetadataTree
from swarmstar.objects.nodes.base_action_node import BaseActionNode

# Load environment variables from .env file
load_dotenv()


@strawberry.type
class GqlUser:
    id: str
    swarms: List['GqlSwarm'] = []


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
    action_metadata_tree: List[ActionMetadataNode]
    memory_metadata_tree: List[MemoryMetadataNode]
    tool_metadata_trees: Dict[ToolTypeEnum, List[ToolNode]]


@strawberry.input
class GqlCreateSwarmInput:
    swarm_name: str
    goal: str
    memory_id: str


@strawberry.type
class Query:
    @strawberry.field
    async def user(self, id: str) -> GqlUser:
        user = await User.read(id)
        return GqlUser(
            id=user.id,
            swarms=[GqlSwarm(**swarm.model_dump()) for swarm in user.swarms],
        )


@strawberry.type
class Mutation:
    @strawberry.mutation
    def create_swarm(self, input: GqlCreateSwarmInput) -> GqlSwarm:
        new_swarm = SwarmstarSpace(
            goal=input.goal,
            swarm_title=input.swarm_name,
            memory_title=input.memory_id,
        )
        return GqlSwarm(**new_swarm.model_dump())


schema = strawberry.Schema(query=Query, mutation=Mutation)