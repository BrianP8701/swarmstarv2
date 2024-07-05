"""
The action metadata tree allows the swarm to find actions to take.
"""
from typing import ClassVar

from swarmstar.types.base_tree import BaseTree

class SwarmTree(BaseTree):
    collection: ClassVar[str] = "swarm_nodes"
