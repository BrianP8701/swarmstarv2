"""
Think of a metadata tree as a file system, where files and folders
are all labeled with descriptions and other metadata.

LLMs can navigate metadata trees by descriptions to find relevant information, or modify the tree.
"""
from abc import abstractmethod
from typing import ClassVar, List
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode
from swarmstar.objects.trees.base_tree import BaseTree

class MetadataTree(BaseTree):
    __node_object__: ClassVar[BaseMetadataNode]
    __branch_size_soft_limit__: ClassVar[int]
    __branch_size_hard_limit__: ClassVar[int]
    __node_level_fallback__: ClassVar[bool]
    __tool_fallback__: ClassVar[bool]
    
    def search(self, ):
        """
        Searches the tree for a node given a description or question.
        
        Throughout the search, we mark nodes as visited or wrong. 
        If we fully explore a branch we will navigate back up the tree to try
        other paths.
        If we exhaust all paths, we will call fallback.
        
        Memory nodes however are unique, in the sense that in addition to searching
        existing nodes, every memory node type also has a toolset that can be searched.
        
        This can be thought of as a fallback at the memory node level. However
        action metadata trees don't have a need for node level fallback. So node level
        fallback should be optional.
        
        There's also two more considerations that need to be made.
        """
        pass

    def add(self):
        pass

    def remove(self):
        pass

    def modify(self):
        pass

    @abstractmethod
    def tree_level_fallback(self):
        """
        Called when we exhaust all paths and reach the root of the tree.
        """
        pass

    def node_level_fallback(self):
        """
        Called when a node has no options but to go up a level.
        """
        pass
