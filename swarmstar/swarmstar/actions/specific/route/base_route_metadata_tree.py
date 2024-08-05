"""
Think of a metadata tree as a file system, where files and folders
are all labeled with descriptions and other metadata.

LLMs can navigate metadata trees by descriptions to find relevant information, or modify the tree.
"""
from abc import ABC, abstractmethod
from typing import ClassVar, List, Tuple, TypeVar

from swarmstar.enums.router_status_enum import RouterStatusEnum
from swarmstar.instructors.instructors.router_instructor import RouterInstructor
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.objects.trees.base_tree import BaseTree
from swarmstar.shapes.contexts.base_route_metadata_tree_context import BaseRouteMetadataTreeContext
from swarmstar.utils.misc.ids import extract_swarm_id

T = TypeVar('T', bound='BaseRouteMetadataTree')

class BaseRouteMetadataTree(BaseActionNode, ABC):
    parent_metadata_node_id = 'route'

    metadata_node_class: ClassVar[BaseMetadataNode]
    tree_class: ClassVar[BaseTree]
    system_prompt: ClassVar[str]

    context: BaseRouteMetadataTreeContext

    async def main(self) -> List[BaseOperation] | BaseOperation:
        """Main method to navigate the metadata tree."""
        node = await self._get_start_node()
        status = RouterStatusEnum.SEARCHING

        while True:
            if status == RouterStatusEnum.SUCCESS:
                return self._handle_success(node)
            elif status == RouterStatusEnum.NO_VIABLE_OPTIONS:
                status, node = await self._backtrack(node)
            elif status == RouterStatusEnum.SEARCHING:
                status, node = await self._search(node)
            elif status == RouterStatusEnum.NO_CHILDREN:
                status, node = await self._handle_no_children(node)
            elif status == RouterStatusEnum.FAILURE:
                return self._tree_level_fallback()
            else:
                raise ValueError(f"Invalid router status: {status}")

    async def _get_start_node(self) -> BaseMetadataNode:
        """Retrieve the start node based on the context."""
        if self.context.start_node_id:
            return await self.metadata_node_class.read(self.context.start_node_id)
        return await self.metadata_node_class.read(self.tree_class.get_root_node_id(extract_swarm_id(self.operation.id)))

    async def _search(self, node: BaseMetadataNode) -> Tuple[RouterStatusEnum, BaseMetadataNode]:
        """Search for viable child nodes."""
        children = await node.get_children()
        if not children:
            return RouterStatusEnum.NO_CHILDREN, node
        if len(children) == 1:
            return self._single_child_search(children[0])
        return await self._multiple_children_search(node, children)

    def _single_child_search(self, child: BaseMetadataNode) -> Tuple[RouterStatusEnum, BaseMetadataNode]:
        """Handle search when there is only one child."""
        self.context.marked_node_ids.append(child.id)
        return RouterStatusEnum.SEARCHING, child

    async def _multiple_children_search(self, node: BaseMetadataNode, children: List[BaseMetadataNode]) -> Tuple[RouterStatusEnum, BaseMetadataNode]:
        """Handle search when there are multiple children."""
        viable_children = self._remove_unviable_nodes(children)
        if not viable_children:
            return RouterStatusEnum.NO_VIABLE_OPTIONS, node

        router_response = await RouterInstructor.route(
            [child.description for child in children], 
            self.context.content,
            self.system_prompt,
            self.id
        )

        if router_response.best_option is not None:
            self._mark_unviable_nodes(children, router_response.unviable_options)
            selected_node = children[router_response.best_option]
            self.context.marked_node_ids.append(selected_node.id)
            return RouterStatusEnum.SEARCHING, selected_node

        self._mark_unviable_nodes(children, [index for index in range(len(children))])
        return RouterStatusEnum.NO_VIABLE_OPTIONS, node

    def _mark_unviable_nodes(self, children: List[BaseMetadataNode], unviable_options: List[int]):
        """Mark unviable nodes based on router response."""
        self.context.marked_node_ids.extend(children[index].id for index in unviable_options)

    def _remove_unviable_nodes(self, children: List[BaseMetadataNode]) -> List[BaseMetadataNode]:
        """Remove nodes that are marked as unviable."""
        return [child for child in children if child.id not in self.context.marked_node_ids]

    async def _backtrack(self, node: BaseMetadataNode) -> Tuple[RouterStatusEnum, BaseMetadataNode]:
        """Backtrack to the parent node if no viable options are found."""
        while True:
            parent_node = await node.get_parent()
            if parent_node:
                node = parent_node
                self.context.marked_node_ids.append(node.id)
                filtered_children = self._remove_unviable_nodes(await node.get_children())
                if filtered_children:
                    return RouterStatusEnum.SEARCHING, node
            else:
                return RouterStatusEnum.FAILURE, node

    @abstractmethod
    async def _handle_no_children(self, node: BaseMetadataNode) -> Tuple[RouterStatusEnum, BaseMetadataNode]:
        """Handle case when no children are found."""
        pass

    @abstractmethod
    def _tree_level_fallback(self) -> List[BaseOperation] | BaseOperation:
        """Fallback method when the tree navigation fails."""
        pass

    @abstractmethod
    def _handle_success(self, node: BaseMetadataNode) -> List[BaseOperation] | BaseOperation:
        """Handle successful navigation."""
        pass
