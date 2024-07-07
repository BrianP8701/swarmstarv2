"""
Nodes can perform 1 of 5 "SwarmOperations":
    - SpawnOperation
    - ActionOperation
    - TerminationOperation
    - BlockingOperation
    - CommunicationOperation
"""
from typing import Any, Dict
from abc import ABC

from swarmstar.swarmstar.objects.base_object import BaseObject
from swarmstar.swarmstar.objects.nodes.swarm_node import SwarmNode

class BaseOperation(BaseObject, ABC):
    swarm_node_id: str
    context: Dict[str, Any] = {}

    swarm_node: SwarmNode
