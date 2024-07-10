"""
The swarm consists of nodes. Each node is given a goal
and a preassigned action they will execute.
"""
from typing import Any, Dict, List, Optional

from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.enums.swarm_node_status_enum import SwarmNodeStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.models.swarm_node_model import SwarmNodeModel
from swarmstar.objects.nodes.base_node import BaseNode
from swarmstar.objects.base_message import BaseMessage

class SwarmNode(BaseNode['SwarmNode']):
    __table__ = DatabaseTableEnum.SWARM_NODES
    __object_model__ = SwarmNodeModel

    action_type: ActionTypeEnum    # Swarm nodes are classified by their action id
    goal: str
    status: SwarmNodeStatusEnum = SwarmNodeStatusEnum.ACTIVE
    termination_policy: TerminationPolicyEnum = TerminationPolicyEnum.SIMPLE
    logs: List[Any] = []              # Logs storing all messages sent to and received from an ai throughout the action's execution.
    report: Optional[str] = None                    # We should look at the node and see like, "Okay, thats what this node did." 
    context: Dict[str, Any] = {}          # This is where certain nodes can store extra context about themselves.

    async def log(self, message: BaseMessage, index_key: List[int] | None = None) -> List[int]:
        """
        This function appends a message to the logs in a node.
        
        If you are not doing parallel logs, you can ignore the index_key parameter.
        Parallel logs are logs that were performed in parallel. For example, if within 
        one node we have multiple conversations in parallel, we don't want these to 
        overlap in the logs.

        If index_key is None, the log will be appended to the developer_logs list.
        If an index_key is provided, the log will be appended to the nested list at the index_key.

        The function can create a new empty list and add the log if the list doesn't exist,
        but it can only create one list at a time. If an attempt is made to create more than one list
        at a time, an error will be raised.

        :param log_dict: A dictionary representing the log to be added.
        :param index_key: A list of integers representing the index path to the nested list where the log should be added.
        :raises ValueError: If an attempt is made to create more than one list at a time.

        :return: The index_key of the log that was added.
        """
        return_index_key = []
        if index_key is None:
            self.logs.append(message.model_dump())
            return_index_key = [len(self.logs) - 1]
        else:
            nested_list = self.logs
            for i, index in enumerate(index_key):
                if index > len(nested_list):
                    raise IndexError(f"Index {index} is out of range for the current list. {nested_list}")
                if i == len(index_key) - 1:
                    if len(nested_list) == index:
                        nested_list.append([message.model_dump()])
                        return_index_key = index_key + [0]
                    elif isinstance(nested_list[index], list):
                        nested_list[index].append(message.model_dump())
                        return_index_key = index_key + [len(nested_list[index]) - 1]
                    else:
                        nested_list[index] = [nested_list[index], message.model_dump()]
                        return_index_key = index_key + [1]
                else:
                    if isinstance(nested_list[index], list):
                        nested_list = nested_list[index]
                    else:
                        raise ValueError("Invalid index_key. Cannot traverse non-list elements.")
        await self.upsert()
        return return_index_key

    async def log_multiple(self, messages: List[BaseMessage], index_key: List[int] | None = None) -> List[int]:
        for message in messages:
            index_key = await self.log(message, index_key)
        if index_key is None:
            raise ValueError("Index key is None after calling log. This should never happen.")
        return index_key
