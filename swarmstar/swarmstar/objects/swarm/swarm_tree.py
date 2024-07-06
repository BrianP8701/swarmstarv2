"""
The action metadata tree allows the swarm to find actions to take.
"""
from typing import ClassVar

from swarmstar.objects.base_tree import BaseTree
from swarmstar.swarmstar.enums.database_collection import DatabaseCollection

class SwarmTree(BaseTree):
    collection: ClassVar[DatabaseCollection] = DatabaseCollection.SWARM_NODES
