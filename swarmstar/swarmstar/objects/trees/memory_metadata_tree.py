from typing import ClassVar, List, Union, Dict
from data.models.memory_metadata_node_model import MemoryMetadataNodeModel
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.objects.nodes.memory_metadata_node import MemoryMetadataNode
from swarmstar.objects.operations.action_operation import ActionOperation
from swarmstar.objects.trees.base_metadata_tree import BaseMetadataTree, MetadataTreeSearchInput, MetadataTreeSearchState

class MemoryMetadataTreeSearchInput(MetadataTreeSearchInput):
    questions: List[str]
    context: str

class MemoryMetadataTreeSearchState(MetadataTreeSearchState):
    original_questions: List[str]
    original_context: str
    remaining_questions: List[str]
    risk_of_incorrect_node_mark: bool
    original_question_index_to_answer: Dict[int, str]

class MemoryMetadataTree(BaseMetadataTree):
    __table__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.MEMORY_METADATA_NODES
    __node_object__: ClassVar[MemoryMetadataNode]
    __node_model__: ClassVar[MemoryMetadataNodeModel]
    __branch_size_soft_limit__: ClassVar[int]
    __branch_size_hard_limit__: ClassVar[int]

    def add(self):
        pass

    def remove(self):
        pass

    """ Search Helpers """

    def _search_initialize_state(
        self, 
        input: MemoryMetadataTreeSearchInput, 
        start_node: MemoryMetadataNode, 
        action_operation: ActionOperation
    ) -> MemoryMetadataTreeSearchState:
        return MemoryMetadataTreeSearchState(
            action_operation=action_operation,
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
        formatted_questions = "\n".join(f"{i+1}. {q}" for i, q in enumerate(state.remaining_questions))
        return f"Choose the best path to find the answer:\n{formatted_questions}\n\nContext:\n{state.original_context}"

    def _search_handle_no_children(self, state: MemoryMetadataTreeSearchState) -> Union[str, MemoryMetadataNode, None]:
        pass

    def _search_tree_level_fallback(self, state: MemoryMetadataTreeSearchState):
        pass
