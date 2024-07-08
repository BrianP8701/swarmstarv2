"""
The memory metadata tree allows the swarm to find answers to questions.
"""
from typing import ClassVar

from swarmstar.objects.trees.base_metadata_tree import MetadataTree

class MemoryMetadataTree(MetadataTree):
    __table__: ClassVar[str] = "memory_metadata"

    # @classmethod
    # def instantiate(cls, swarm_id: str) -> None:
    #     super()._instantiate(cls.collection, swarm_id)