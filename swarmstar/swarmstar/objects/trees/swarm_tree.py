"""
The action metadata tree allows the swarm to find actions to take.
"""
from typing import ClassVar

from swarmstar.objects.trees.base_tree import BaseTree
from swarmstar.enums.database_table_enum import DatabaseTable

class SwarmTree(BaseTree):
    __table__: ClassVar[DatabaseTable] = DatabaseTable.SWARM_NODES
