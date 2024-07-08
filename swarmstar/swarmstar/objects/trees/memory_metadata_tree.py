"""
Think of a metadata tree as a file system, where files and folders
are all labeled with descriptions and other metadata.

LLMs can navigate metadata trees by descriptions to find relevant information, or modify the tree.
"""
from abc import abstractmethod
from typing import ClassVar, List, Union, Dict
from swarmstar.objects.nodes.memory_metadata_node import MemoryMetadataNode
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.trees.base_metadata_tree import MetadataTree, MetadataTreeSearchInput, MetadataTreeSearchState

class MemoryMetadataTreeSearchInput(MetadataTreeSearchInput):
    questions: List[str]
    context: str

class MemoryMetadataTreeSearchState(MetadataTreeSearchState):
    original_questions: List[str]
    original_context: str
    remaining_questions: List[str]
    risk_of_incorrect_node_mark: bool
    original_question_index_to_answer: Dict[int, str]

class MemoryMetadataTree(MetadataTree):
    __node_object__: ClassVar[MemoryMetadataNode]
    __branch_size_soft_limit__: ClassVar[int]
    __branch_size_hard_limit__: ClassVar[int]

    def add(self):
        pass

    def remove(self):
        pass

    """ Search Helpers """

    def _search_initialize_state(self, input: MemoryMetadataTreeSearchInput, start_node: MemoryMetadataNode, swarm_node: SwarmNode) -> MemoryMetadataTreeSearchState:
        return MemoryMetadataTreeSearchState(
            swarm_node=swarm_node,
            start_node=start_node,
            current_node=start_node,
            marked_node_ids=[start_node.id],
            original_questions=input.questions,
            original_context=input.context,
            remaining_questions=input.questions,
            risk_of_incorrect_node_mark=False,
            original_question_index_to_answer={}
        )

    def _search_format_prompt(self, state: MemoryMetadataTreeSearchState) -> str:
        return f"You are looking to answer the following questions: {state.original_questions} in the context of the following memory: {state.original_context}"

    def _search_handle_no_children(self, state: MemoryMetadataTreeSearchState) -> Union[str, MemoryMetadataNode, None]:
        pass

    def _search_tree_level_fallback(self, state: MemoryMetadataTreeSearchState):
        pass