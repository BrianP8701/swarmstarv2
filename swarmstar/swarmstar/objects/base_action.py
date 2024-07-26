"""
Actions are code.

Here we define the base class for actions, which:
    - Ties each action to the node it is running on.
    - Applies an error handling wrapper that is applied to all functions
        inside the action. This wrapper induces an attempt to have the
        swarm debug and handle the error on its own.
    - Wrappers to abstract away common functionality like enforcing that
        decisions are made with full context, receiving LLM completions,
        termination handlers, etc.
"""
from abc import ABC, abstractmethod
from functools import wraps
from typing import Any, ClassVar, List, Callable, Optional, Tuple, Type, Union, cast
from swarmstar.contexts.base_context import BaseContext
from swarmstar.contexts.question_context import QuestionContext

from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.swarm_node_status_enum import ActionStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.instructor.instructor_client import Instructor
from swarmstar.instructor.instructors.question_instructor import QuestionInstructor
from swarmstar.objects import BaseOperation
from swarmstar.objects.message import Message
from swarmstar.objects.nodes.base_node import BaseNode
from swarmstar.objects.operations.function_call_operation import FunctionCallOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation

instructor = Instructor()

class BaseAction(BaseNode['BaseAction'], ABC):
    __action_metadata_node_id__: ClassVar[str]
    __parent_metadata_node_id__: ClassVar[str]
    __children_metadata_node_ids__: ClassVar[List[str]] = []
    __action_enum__: ClassVar[ActionEnum]
    __node_context_class__: ClassVar[Type[BaseContext]]
    __description__: ClassVar[str]
    
    goal: str
    status: ActionStatusEnum = ActionStatusEnum.ACTIVE
    termination_policy: TerminationPolicyEnum = TerminationPolicyEnum.SIMPLE
    message_ids: List[Union[List[str], str]] = []                       # Structure of ids of messages that have been sent to and received from this node.
    report: Optional[str] = None                                        # We should look at the node and see like, "Okay, thats what this node did." 
    context: BaseContext                                                # This is where nodes can store extra context about themselves.
    operation: FunctionCallOperation

    @abstractmethod
    async def main(self) -> List[BaseOperation]:
        pass        

    async def submit_report(self, report: str):
        if self.report is not None:
            raise ValueError(f"Node {self.id} already has a report: {self.report}. Cannot update with {report}.")
        self.report = report
        await self.upsert()

    """ Wrappers for handling common functionality """
    @staticmethod
    def custom_termination_handler(func: Callable):
        """
            This decorator is used to mark a function as a custom termination handler.

            Functions marked with this decorator should accept two parameters:
                - terminator_id: The id of the terminator node that this node spawned
                - context: Context persisted from spawning the terminator node

            This allows us to easily spawn new nodes, and then respond to the termination of those nodes.
        """
        def wrapper(self, **kwargs):
            terminator_id = kwargs.pop("terminator_id", None)
            context = kwargs.pop("context", None)

            if not terminator_id:
                raise ValueError(f"terminator_id is a required parameter for custom_termination_handler. Error in {self.node.id} at function {func.__name__}")
            if not context:
                raise ValueError(f"context is a required parameter for custom_termination_handler. Error in {self.node.id} at function {func.__name__}")

            return func(self, terminator_id, context)
        return wrapper

    @staticmethod
    async def question_wrapper(func: Callable[..., Any]):
        """
        This wrapper abstracts search away from actions.
        """
        @wraps(func)
        async def wrapper(self):
            do_we_need_search, search_operation = await self._ask_questions()
            if do_we_need_search:
                return [search_operation]
            else:
                return await func(self)

        return wrapper

    async def _ask_questions(self, goal: str) -> Tuple[bool, SpawnOperation | None]:
        questions = await Instructor.instruct(
            QuestionInstructor.write_instructions(goal),
            QuestionInstructor,
            self.operation
        )
        if questions.do_we_need_search:
            if questions.questions is None:
                raise ValueError(f"QuestionInstructor returned None for questions despite do_we_need_search being True in swarm node {self.id} at operation {self.operation.id}")

            questions_string = "\t-" + "\n\t-".join(questions.questions)
            return True, SpawnOperation(
                swarm_node_id=self.id,
                action_enum=ActionEnum.SEARCH,
                goal=f'Find answers to the following questions:\n{questions_string}',
                context=QuestionContext(
                    **self.operation.context, 
                    questions=questions.questions
                ).model_dump()
            )
        else:
            return False, None

    async def log(self, message: Message, keys: Optional[List[int]] = None) -> List[int]:
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

        if keys:
            keys[-1] += 1
            return keys
        else:
            return [len(self.message_ids) - 1]

    async def log_multiple(self, messages: List[Message], keys: Optional[List[int]] = None) -> List[int]:
        """
        Logs multiple messages to the node.
        """
        for message in messages:
            keys = await self.log(message, keys)

        if keys:
            return keys
        else:
            return [len(self.message_ids) - 1]

    def create_nested_log(self, keys: Optional[List[int]] = None) -> List[int]:
        """
        Creates a nested log.
        """
        if keys:
            log = self._get_nested_message_ids(keys)
            log.append([])
            return keys + [len(log) - 1]
        else:
            self.message_ids.append([])
            return []

    def _get_nested_message_ids(self, keys: List[int]) -> List[Union[List[str], str]]:
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
            return cast(List[Union[List[str], str]], nested_log)
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
