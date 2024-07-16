from typing import ClassVar, Union
from data.models.action_metadata_node_model import ActionMetadataNodeModel
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.objects.operations.action_operation import ActionOperation
from swarmstar.objects.trees.base_metadata_tree import MetadataTreeSearchInput, MetadataTreeSearchState
from swarmstar.objects.trees.base_tree import BaseTree

class ActionMetadataTreeSearchInput(MetadataTreeSearchInput):
    goal: str

class ActionMetadataTreeSearchState(MetadataTreeSearchState):
    goal: str

class ActionMetadataTree(BaseTree):
    __table__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.ACTION_METADATA_NODES
    __node_object__: ClassVar[ActionMetadataNode]
    __node_model__: ClassVar[ActionMetadataNodeModel]
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