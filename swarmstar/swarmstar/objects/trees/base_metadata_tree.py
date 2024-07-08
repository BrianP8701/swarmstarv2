"""
Think of a metadata tree as a file system, where files and folders
are all labeled with descriptions and other metadata.

LLMs can navigate metadata trees by descriptions to find relevant information, or modify the tree.
"""
from abc import abstractmethod
from calendar import c
from typing import ClassVar, List, Union
from pydantic import BaseModel
from swarmstar.enums.metadata_tree_enums import MetadataTreeSearchOutputType
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.router import Router
from swarmstar.objects.trees.base_tree import BaseTree

class MetadataTreeSearchInput(BaseModel):
    swarm_node_id: str
    start_node_id: str | None
    output_type: MetadataTreeSearchOutputType

class MetadataTreeSearchState(BaseModel):
    swarm_node: SwarmNode
    start_node: BaseMetadataNode
    current_node: BaseMetadataNode
    marked_node_ids: List[str]

class MetadataTree(BaseTree):
    __node_object__: ClassVar[BaseMetadataNode]
    __branch_size_soft_limit__: ClassVar[int]
    __branch_size_hard_limit__: ClassVar[int]

    async def search(self, input: MetadataTreeSearchInput) -> Union[str, BaseMetadataNode, None]:
        if input.start_node_id:
            start_node = await self.__node_object__.read(input.start_node_id)
        else:
            start_node = await self.__node_object__.read(self.get_root_node_id(input.swarm_node_id))
        state = self._search_initialize_state(input, start_node, await SwarmNode.read(input.swarm_node_id))

        while True:
            await self._search(state)
            # TODO: Continue the search process
        pass

    def add(self):
        pass

    def remove(self):
        pass

    """ Search Helpers """

    async def _search(self, state: MetadataTreeSearchState) -> None:
        children = await state.current_node.get_children()
        if len(children) == 0:
            self._search_handle_no_children(state)
        elif len(children) == 1:
            state.current_node = children[0]
            state.marked_node_ids.append(state.current_node.id)
        else:
            children = self._search_filter_marked_nodes(state, children)
            router_response = await Router.route(children, self._search_format_prompt(state))
            state.marked_node_ids.extend(unviable_option.id for unviable_option in router_response.unviable_options)
            if router_response.best_option:
                state.current_node = router_response.best_option
                state.marked_node_ids.append(state.current_node.id)

    def _search_filter_marked_nodes(self, state: MetadataTreeSearchState, children: List[BaseMetadataNode]):
        for child in reversed(children):
            if child.id in state.marked_node_ids:
                children.remove(child)
        return children

    async def _search_backtrack(self, state: MetadataTreeSearchState):
        while True:
            parent_node = await state.current_node.get_parent()
            if parent_node:
                state.current_node = parent_node
                state.marked_node_ids.append(state.current_node.id)
                children = await state.current_node.get_children()
                filtered_children = self._search_filter_marked_nodes(state, children)
                if len(filtered_children) > 0:
                    return
                else:
                    continue
            else:
                self._search_tree_level_fallback(state)

    @abstractmethod
    def _search_initialize_state(self, input: MetadataTreeSearchInput, start_node: BaseMetadataNode, swarm_node: SwarmNode) -> MetadataTreeSearchState:
        pass

    @abstractmethod
    def _search_format_prompt(self, state: MetadataTreeSearchState) -> str:
        pass

    @abstractmethod
    def _search_handle_no_children(self, state: MetadataTreeSearchState) -> Union[str, BaseMetadataNode, None]:
        pass

    @abstractmethod
    def _search_tree_level_fallback(self, state: MetadataTreeSearchState):
        pass
