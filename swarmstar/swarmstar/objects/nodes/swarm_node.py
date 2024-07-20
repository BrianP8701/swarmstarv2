"""
The swarm consists of nodes. Each node is given a goal
and a preassigned action they will execute.
"""
from typing import Any, Dict, List, Optional, Union, cast
from data.models.swarm_node_model import SwarmNodeModel
from swarmstar.contexts.base_context import BaseContext

from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.enums.swarm_node_status_enum import ActionStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.objects.message import Message
from swarmstar.objects.nodes.base_node import BaseNode

class SwarmNode(BaseNode['SwarmNode']):
    __table__ = DatabaseTableEnum.SWARM_NODES
    __object_model__ = SwarmNodeModel

    action_enum: ActionEnum
    goal: str
    status: ActionStatusEnum = ActionStatusEnum.ACTIVE
    termination_policy: TerminationPolicyEnum = TerminationPolicyEnum.SIMPLE
    message_ids: List[Union[List[str], str]] = []                       # Structure of ids of messages that have been sent to and received from this node.
    report: Optional[str] = None                                        # We should look at the node and see like, "Okay, thats what this node did." 
    context: BaseContext                                        # This is where nodes can store extra context about themselves.

