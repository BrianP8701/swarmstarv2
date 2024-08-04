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
from typing import ClassVar, List, Callable, Optional, Type
from data.models.action_node_model import ActionNodeModel
from pydantic import Field

from swarmstar.instructors.instructors.is_context_sufficient_instructor import IsContextSufficientInstructor
from swarmstar.shapes.contexts.base_context import BaseContext
from swarmstar.shapes.contexts.question_context import QuestionContext
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.action_status_enum import ActionStatusEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.instructors.instructors.question_instructor import QuestionInstructor
from swarmstar.objects import BaseOperation
from swarmstar.objects.message import Message
from swarmstar.objects.nodes.base_node import BaseNode
from swarmstar.objects.operations.spawn_operation import SpawnOperation

class BaseActionNode(BaseNode['BaseActionNode'], ABC):
    __action_metadata_node_id__: ClassVar[str]
    __parent_metadata_node_id__: ClassVar[str]
    __children_metadata_node_ids__: ClassVar[List[str]] = []
    __description__: ClassVar[str]
    __operation__: ClassVar[BaseOperation]
    __context_class__: ClassVar[BaseContext]
    __model_class__: ClassVar[Type['ActionNodeModel']] = ActionNodeModel
    action_enum: ClassVar[ActionEnum]

    goal: str
    status: ActionStatusEnum = ActionStatusEnum.ACTIVE
    termination_policy_enum: TerminationPolicyEnum = TerminationPolicyEnum.SIMPLE
    message_ids: List[str] = []                       # Structure of ids of messages that have been sent to and received from this node.
    report: Optional[str] = None                     # We should look at the node and see like, "Okay, thats what this node did." 
    context: BaseContext
    context_history: List[str] = Field(
        description="A list of context strings for the node's task. The most recent context is at the last index, and the list is maintained for observability.",
        default=lambda: []
    )
    operations_ids: List[str] = []

    @abstractmethod
    async def main(self) -> List[BaseOperation] | BaseOperation:
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

    async def is_context_sufficient(self, content: str) -> bool:
        """
        Ensures sufficient context for the given content, which can be a goal, plan, task, problem, or bug.
        If additional context is needed, it generates questions and initiates a search for answers.

        :param content: The content for which context is being ensured.
        :return: A boolean indicating whether the context is sufficient.
        """        
        is_context_sufficient = await IsContextSufficientInstructor.is_context_sufficient(
            content,
            self.get_most_recent_context(),
            self.id
        )
        return is_context_sufficient.is_context_sufficient_boolean

    async def ask_questions(self, content: str) -> SpawnOperation:
        """
        Creates a SpawnOperation for searching answers to the given questions.

        :param questions: The list of questions to be answered.
        :return: The SpawnOperation for the search.
        """
        questions = await QuestionInstructor.ask_questions(
            content, 
            self.get_most_recent_context(), 
            self.id
        )
        
        questions_string = "\t-" + "\n\t-".join(questions.questions)
        return SpawnOperation(
            action_node_id=self.id,
            action_enum=ActionEnum.SEARCH,
            goal=f'Find answers to the following questions:\n{questions_string}',
            context=QuestionContext(
                questions=questions.questions
            )
        )

    async def log(self, message: Message) -> None:
        self.message_ids.append(message.id)
        await self.upsert()

    async def log_multiple(self, messages: List[Message]) -> None:
        for message in messages:
            await self.log(message)
        await self.upsert()

    def get_most_recent_context(self) -> Optional[str]:
        return self.context_history[-1] if self.context_history else None
