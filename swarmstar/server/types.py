from typing import Dict
from pydantic import BaseModel

class WebsocketMessage(BaseModel):
    title: str
    payload: str

class CreateSwarmPayload(BaseModel):
    swarm_title: str
    memory_title: str
    goal: str
    environment_vars: Dict[str, str]

class SendSwarmMessagePayload(BaseModel):
    message: str
    swarm_node_id: str

