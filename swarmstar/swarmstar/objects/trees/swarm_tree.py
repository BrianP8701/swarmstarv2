"""
The action metadata tree allows the swarm to find actions to take.
"""
from typing import ClassVar

from swarmstar.objects.trees.base_tree import BaseTree
from swarmstar.enums.database_table_enum import DatabaseTableEnum

class SwarmTree(BaseTree):
    __table_enum__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.SWARM_NODES
