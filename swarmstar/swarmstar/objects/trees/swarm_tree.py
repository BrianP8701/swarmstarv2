"""
The action metadata tree allows the swarm to find actions to take.
"""
from typing import ClassVar

from swarmstar.swarmstar.objects.trees.base_tree import BaseTree
from swarmstar.swarmstar.enums.database_table import DatabaseTable

class SwarmTree(BaseTree):
    __table__: ClassVar[DatabaseTable] = DatabaseTable.SWARM_NODES
