from typing import List, Tuple, Type

from swarmstar.actions.specific.route.base_route_metadata_tree import (
    BaseRouteMetadataTree,
)
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.router_status_enum import RouterStatusEnum
from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation
from swarmstar.objects.trees.action_metadata_tree import ActionMetadataTree
from swarmstar.objects.trees.base_tree import BaseTree
from swarmstar.shapes.contexts.base_context import BaseContext
from swarmstar.shapes.contexts.route_action_context import RouteActionContext


class RouteAction(BaseRouteMetadataTree):
    node_id = "route_action"
    action_metadata_node_id = "route_action"
    title = "Route Action"
    action_enum = ActionEnum.ROUTE_ACTION
    context_class: Type[RouteActionContext] = RouteActionContext
    description = "This actions finds the best action to take given a goal or task."
    metadata_node_class: Type[BaseMetadataNode] = ActionMetadataNode
    tree_class: Type[BaseTree] = ActionMetadataTree
    system_prompt = (
        "Given the goal or task, decide what would be the best path of action to take."
    )

    context: RouteActionContext

    async def _handle_no_children(
        self, node: ActionMetadataNode
    ) -> Tuple[RouterStatusEnum, BaseMetadataNode]:
        return RouterStatusEnum.SUCCESS, node

    async def _handle_success(self, node: ActionMetadataNode) -> SpawnOperation:
        return SpawnOperation(
            swarm_id=self.swarm_id,
            action_node_id=node.id,
            goal=self.context.content,
            action_enum=node.action_enum,
            context=BaseContext(),
        )

    async def _tree_level_fallback(self) -> List[BaseOperation] | BaseOperation:
        raise NotImplementedError("RouteAction does not support tree level fallback")
        # TODO: Tree Level Fallback is creating it's own action
