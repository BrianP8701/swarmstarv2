"""
    confirm_directive_completion is a termination policy for nodes of type 'decompose_directive'.
    
    A node of this type decomposes its directive into immediate parallelizable actionable subdirectives.
    Thus it will have multiple children, and in addition it's goal might not be accomplished even when
    all it's children have terminated. We thus have a specific termination policy for nodes of this type.
    
    1. If any children are alive, do nothing.
    2. If all children are terminated spawn the 'confirm_directive_completion' node.
    3. If all children are terminated including a 'confirm_directive_completion' node, 
        terminate the node.
"""
from typing import Union

from swarmstar.objects import (
    SpawnOperation,
    TerminationOperation,
    SwarmNode
)


def terminate(termination_operation: TerminationOperation) -> Union[TerminationOperation, None]:
    node_id = termination_operation.node_id
    target_node = SwarmNode.read(node_id)

    if target_node.type != "general/decompose_directive":
        raise ValueError("Review directive termination policy can only be applied to nodes of type 'decompose directive'") 
    
    mission_completion = False

    for child_id in target_node.children_ids:
        child = SwarmNode.read(child_id)
        if child.alive:
            return None
        if child.type == "specific/managerial/confirm_directive_completion":
            mission_completion = True

    if mission_completion == False:
        return SpawnOperation(
            parent_id=node_id,
            action_id="specific/managerial/confirm_directive_completion",
            message="",
        )
    else:
        target_node.alive = False
        SwarmNode.update(target_node)
        if target_node.parent_id is None:
            return None
        else:
            parent_node = SwarmNode.read(target_node.parent_id)
            return TerminationOperation(
                terminator_id=node_id,
                node_id=parent_node.id,
            )
