import strawberry


@strawberry.input
class GqlCreateSwarmInput:
    swarm_name: str
    goal: str
    memory_id: str