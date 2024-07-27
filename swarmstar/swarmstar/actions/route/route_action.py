from typing import List, Tuple, Type

from swarmstar.actions.route.base_route_metadata_tree import BaseRouteMetadataTree
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.router_status_enum import RouterStatusEnum
from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation
from swarmstar.objects.trees.action_metadata_tree import ActionMetadataTree
from swarmstar.shapes.contexts.route_action_context import RouteActionContext

class RouteAction(BaseRouteMetadataTree):
    __action_metadata_node_id__ = "route_action"
    __title__ = "Route Action"
    __action_enum__ = ActionEnum.ROUTE_ACTION
    __context_class__: Type[RouteActionContext] = RouteActionContext
    __description__ = "This actions finds the best action to take given a goal or task."
    __metadata_node_class__ = ActionMetadataNode
    __tree_class__ = ActionMetadataTree
    __system_prompt__ = "Given the goal or task, decide what would be the best path of action to take."

    context: RouteActionContext

    async def _handle_no_children(self, node: ActionMetadataNode) -> Tuple[RouterStatusEnum, BaseMetadataNode]:
        return RouterStatusEnum.SUCCESS, node

    async def _handle_success(self, node: ActionMetadataNode) -> SpawnOperation:
        return SpawnOperation(
            action_node_id=node.id,
            goal=self.context.content,
            action_enum=node.action_enum,
        )

    async def _tree_level_fallback(self) -> List[BaseOperation] | BaseOperation:
        raise NotImplementedError("RouteAction does not support tree level fallback")
        # TODO: Tree Level Fallback is creating it's own action
