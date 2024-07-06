"""
The action metadata tree allows the swarm to find actions to take.
"""
from typing import ClassVar

from swarmstar.swarmstar.objects.trees.base_metadata_tree import MetadataTree

class ActionMetadataTree(MetadataTree):
    __table__: ClassVar[str] = "action_metadata"
