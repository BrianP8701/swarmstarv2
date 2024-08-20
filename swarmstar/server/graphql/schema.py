from typing import List

import strawberry
from dotenv import load_dotenv

from swarmstar.objects.swarmstar_space import SwarmstarSpace
from swarmstar.objects.user import User

from .inputs import GqlCreateSwarmInput
from .types import GqlSwarm, GqlUser

load_dotenv()

@strawberry.type
class Query:
    @strawberry.field
    async def user(self, id: str) -> GqlUser:
        user = await User.read(id)
        return GqlUser(**user.model_dump())


@strawberry.type
class Mutation:
    @strawberry.mutation
    async def create_swarm(self, input: GqlCreateSwarmInput) -> GqlSwarm:
        new_swarm, spawn_root_operation = await SwarmstarSpace.instantiate(
            goal=input.goal,
            swarm_title=input.swarm_name,
            memory_title=input.memory_id,
        )
        
        return GqlSwarm(**new_swarm.model_dump())


schema = strawberry.Schema(query=Query, mutation=Mutation)
