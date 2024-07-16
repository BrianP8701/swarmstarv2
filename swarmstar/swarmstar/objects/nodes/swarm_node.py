"""
The swarm consists of nodes. Each node is given a goal
and a preassigned action they will execute.
"""
from typing import Any, Dict, List, Optional, Union, cast
from data.models.swarm_node_model import SwarmNodeModel

from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.enums.swarm_node_status_enum import SwarmNodeStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.objects.message import Message
from swarmstar.objects.nodes.base_node import BaseNode

class SwarmNode(BaseNode['SwarmNode']):
    __table__ = DatabaseTableEnum.SWARM_NODES
    __object_model__ = SwarmNodeModel

    action_type: ActionTypeEnum
    goal: str
    status: SwarmNodeStatusEnum = SwarmNodeStatusEnum.ACTIVE
    termination_policy: TerminationPolicyEnum = TerminationPolicyEnum.SIMPLE
    message_ids: List[Union[List[str], str]] = []                       # Structure of ids of messages that have been sent to and received from this node.
    report: Optional[str] = None                                        # We should look at the node and see like, "Okay, thats what this node did." 
    context: Dict[str, Any] = {}                                        # This is where nodes can store extra context about themselves.

    async def log(self, message: Message, keys: Optional[List[int]] = None) -> None:
        """
        Appends a message to the logs. If keys are provided, the log will be added to the nested parallel logs.

        :param message: The message to be logged.
        :param keys: The list of keys representing the path to the nested log.
        """
        if keys:
            nested_log = self._get_nested_message_ids(keys)
            nested_log.append(message.id)
        else:
            self.message_ids.append(message.id)
        await self.upsert()

    def _get_nested_message_ids(self, keys: List[int]) -> List[str]:
        """
        Retrieve a nested message id list based on the provided keys.
        
        :param keys: List of keys representing the path to the nested log.
        :return: The nested message id list.
        """
        nested_log = self.message_ids
        for key in keys:
            if isinstance(nested_log, list):
                nested_log = nested_log[key]
            else:
                raise ValueError(f"Invalid log structure in swarm node {self.id}. Attempted to follow key path: {keys}")
        
        if isinstance(nested_log, list) and all(isinstance(item, str) for item in nested_log):
            return cast(List[str], nested_log)
        else:
            raise ValueError(f"Expected a list of strings at the end of the key path: {keys}")

    @classmethod
    async def get_conversation(cls, node_id: str) -> List[Any]:
        """
        Retrieves the conversation structure as a nested list of lists of strings.
        
        :return: The conversation structure.
        """
        conversation = []
        
        async def recursive_helper(message_id_elements: List[Union[List[str], str]], conversation: List[Any]) -> None:
            for message_id_element in message_id_elements:
                if isinstance(message_id_element, str):
                    message = await Message.read(message_id_element)
                    conversation.append(message)
                elif isinstance(message_id_element, list) and all(isinstance(item, str) for item in message_id_element):
                    conversation.append([])
                    for nested_message_id_element in message_id_element:
                        await recursive_helper(cast(List[Union[List[str], str]], nested_message_id_element), conversation[-1])
                else:
                    raise ValueError(f"Failed to parse conversation in swarm node: {node_id}")

        node = await cls.read(node_id)   
        await recursive_helper(node.message_ids, conversation)
        return conversation
