from typing import ClassVar, Dict, List
from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.swarm_node_status_enum import SwarmNodeStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from data.models.swarm_operation_models import TerminationOperationModel
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.operations.action_operation import ActionOperation
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.objects.operations.spawn_operation import SpawnOperation

TERMINATION_POLICY_MAP: Dict[TerminationPolicyEnum, str] = {
    TerminationPolicyEnum.SIMPLE: '_terminate_simple',
    TerminationPolicyEnum.CONFIRM_DIRECTIVE_COMPLETION: '_terminate_confirm_directive_completion',
    TerminationPolicyEnum.CUSTOM_TERMINATION_HANDLER: '_terminate_custom_termination_handler'
}

class TerminationOperation(BaseOperation):
    __table__: ClassVar[DatabaseTableEnum] = DatabaseTableEnum.TERMINATION_OPERATIONS
    __object_model__: ClassVar[TerminationOperationModel] = TerminationOperationModel

    terminator_id: str

    async def _execute(self) -> List[str]:
        swarm_node = await SwarmNode.read(self.swarm_node_id)
        termination_policy = swarm_node.termination_policy
        termination_handler_function_name = TERMINATION_POLICY_MAP[termination_policy]
        termination_handler_function = getattr(self, termination_handler_function_name)
        return await termination_handler_function(swarm_node)

    async def _terminate_simple(self, swarm_node: SwarmNode) -> List['TerminationOperation']:
        """
        Terminate the node and return a new termination operation for the parent node.
        """
        swarm_node.status = SwarmNodeStatusEnum.TERMINATED
        await swarm_node.upsert()
        parent_node_id = swarm_node.parent_id
        if parent_node_id:
            return [
                TerminationOperation(
                    swarm_node_id=parent_node_id, 
                    terminator_id=swarm_node.id
                )
            ]
        else:
            return []

    async def _terminate_custom_termination_handler(self, swarm_node: SwarmNode) -> List[ActionOperation]:
        """
        Nodes can implement their own termination handlers.
        They can signal that that they want to use their own termination handler by updating their termination policy
        to CUSTOM_TERMINATION_HANDLER and adding a __termination_handler__ key to their context.
        """
        context = swarm_node.context
        termination_handler = context.get("__termination_handler__", None)
        if termination_handler:
            return [ActionOperation(
                swarm_node_id=swarm_node.id,
                function_to_call=termination_handler,
                context=self.context
            )]
        else:
            raise ValueError(f"No termination handler found for action type {swarm_node.action_type} in swarm node {swarm_node.id}")

    async def _terminate_confirm_directive_completion(self, swarm_node: SwarmNode):
        """            
            1. If any children are alive, do nothing.
            2. If all children are terminated spawn the 'confirm_directive_completion' node.
            3. If all children are terminated including a 'confirm_directive_completion' node, 
                terminate the node.
        """
        children_swarm_nodes = await swarm_node.get_children()
        if all(child.status == SwarmNodeStatusEnum.TERMINATED for child in children_swarm_nodes):
            node_has_been_reviewed = next((child for child in children_swarm_nodes if child.action_type == ActionTypeEnum.REVIEW_GOAL_PROGRESS), False)
            if node_has_been_reviewed:
                return await self._terminate_simple(swarm_node)
            else:
                return [
                    SpawnOperation(
                        swarm_node_id=swarm_node.id, 
                        action_type=ActionTypeEnum.REVIEW_GOAL_PROGRESS,
                        goal=swarm_node.goal,
                    )
                ]
        else:
            return []
        # TODO We might want to adapt this logic to not have to wait until all nodes have completed before spawning a review node.
        # You can imagine that some tasks can be done while waiting for all nodes to complete.
