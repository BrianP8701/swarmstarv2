"""
Think of a metadata tree as a file system, where files and folders
are all labeled with descriptions and other metadata.

LLMs can navigate metadata trees by descriptions to find relevant information, or modify the tree.
"""
from abc import abstractmethod
from calendar import c
from typing import ClassVar, List, Union
from pydantic import BaseModel
from swarmstar.enums.database_table_enum import DatabaseTable
from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.operations.action_operation import ActionOperation
from swarmstar.objects.trees.base_metadata_tree import MetadataTreeSearchInput, MetadataTreeSearchState
from swarmstar.objects.trees.base_tree import BaseTree

class ActionMetadataTreeSearchInput(MetadataTreeSearchInput):
    goal: str

class ActionMetadataTreeSearchState(MetadataTreeSearchState):
    goal: str

class ActionMetadataTree(BaseTree):
    __table__: ClassVar[DatabaseTable] = DatabaseTable.ACTION_METADATA_NODES
    __node_object__: ClassVar[ActionMetadataNode]
    # __node_model__: ClassVar[ActionMetadataNodeModel]
    __branch_size_soft_limit__: ClassVar[int]
    __branch_size_hard_limit__: ClassVar[int]

    def add(self):
        pass

    def remove(self):
        pass

    """ Search Helpers """
    def _search_initialize_state(
        self, 
        input: ActionMetadataTreeSearchInput, 
        start_node: ActionMetadataNode, 
        action_operation: ActionOperation
    ) -> ActionMetadataTreeSearchState:
        return ActionMetadataTreeSearchState(
            action_operation=action_operation,
            start_node=start_node,
            current_node=start_node,
            marked_node_ids=[start_node.id],
            goal=input.goal,
        )

    def _search_format_prompt(self, state: ActionMetadataTreeSearchState) -> str:
        return f"Choose the best action path to achieve your goal.\nGoal: {state.goal}"

    def _search_handle_no_children(self, state: ActionMetadataTreeSearchState) -> Union[str, ActionMetadataNode, None]:
        pass

    def _search_tree_level_fallback(self, state: ActionMetadataTreeSearchState):
        pass