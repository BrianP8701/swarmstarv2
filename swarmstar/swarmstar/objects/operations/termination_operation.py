from typing import Dict, List

from data.enums import DatabaseTableEnum
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.action_status_enum import ActionStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.objects.operations.function_call_operation import FunctionCallOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation

TERMINATION_POLICY_MAP: Dict[TerminationPolicyEnum, str] = {
    TerminationPolicyEnum.SIMPLE: '_terminate_simple',
    TerminationPolicyEnum.CONFIRM_DIRECTIVE_COMPLETION: '_terminate_confirm_directive_completion',
    TerminationPolicyEnum.CUSTOM_TERMINATION_HANDLER: '_terminate_custom_termination_handler'
}

class TerminationOperation(BaseOperation):
    table_enum = DatabaseTableEnum.TERMINATION_OPERATIONS
    action_node_id: str

    terminator_id: str

    async def _execute(self) -> List[BaseOperation]:
        action_node = await BaseActionNode.read(self.action_node_id)
        termination_policy = action_node.termination_policy_enum
        
        match termination_policy:
            case TerminationPolicyEnum.SIMPLE:
                return await self._terminate_simple(action_node)
            case TerminationPolicyEnum.CONFIRM_DIRECTIVE_COMPLETION:
                return await self._terminate_confirm_directive_completion(action_node)
            case TerminationPolicyEnum.CUSTOM_TERMINATION_HANDLER:
                return await self._terminate_custom_termination_handler(action_node)
            case _:
                raise ValueError(f"Unknown termination policy: {termination_policy}")

    async def _terminate_simple(self, action_node: BaseActionNode) -> List[BaseOperation]:
        """
        Terminate the node and return a new termination operation for the parent node.
        """
        action_node.status = ActionStatusEnum.TERMINATED
        await action_node.upsert()
        parent_node_id = action_node.parent_id
        if parent_node_id:
            return [
                TerminationOperation(
                    action_node_id=parent_node_id, 
                    terminator_id=action_node.id
                )
            ]
        else:
            return []

    async def _terminate_custom_termination_handler(self, action_node: BaseActionNode) -> List[BaseOperation]:
        """
        Nodes can implement their own termination handlers.
        They can signal that that they want to use their own termination handler by updating their termination policy
        to CUSTOM_TERMINATION_HANDLER and adding a __termination_handler__ key to their context.
        """
        context = action_node.context
        termination_handler = context.termination_handler_function_name
        if termination_handler:
            return [FunctionCallOperation(
                action_node_id=action_node.id,
                function_to_call=termination_handler,
            )]
        else:
            raise ValueError(f"No termination handler found for action node {action_node.id}")

    async def _terminate_confirm_directive_completion(self, action_node: BaseActionNode) -> List[BaseOperation]:
        """            
            1. If any children are alive, do nothing.
            2. If all children are terminated spawn the 'confirm_directive_completion' node.
            3. If all children are terminated including a 'confirm_directive_completion' node, 
                terminate the node.
        """
        children_action_nodes = await action_node.get_children()
        if all(child.status == ActionStatusEnum.TERMINATED for child in children_action_nodes):
            node_has_been_reviewed = next((child for child in children_action_nodes if child.action_enum == ActionEnum.REVIEW_GOAL_PROGRESS), False)
            if node_has_been_reviewed:
                return await self._terminate_simple(action_node)
            else:
                return [
                    SpawnOperation(
                        action_node_id=action_node.id, 
                        action_enum=ActionEnum.REVIEW_GOAL_PROGRESS,
                        goal=action_node.goal,
                        context=action_node.context
                    )
                ]
        else:
            return []
        # TODO We might want to adapt this logic to not have to wait until all nodes have completed before spawning a review node.
        # You can imagine that some tasks can be done while waiting for all nodes to complete.
