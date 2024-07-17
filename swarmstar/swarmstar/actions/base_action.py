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
from abc import abstractmethod
from functools import wraps
from typing import Any, ClassVar, List, Callable, Optional, Tuple
from pydantic import BaseModel
from swarmstar.actions.contexts.question_context import QuestionContext

from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.instructor.instructor import Instructor
from swarmstar.instructor.instructors.question_instructor import QuestionInstructor
from swarmstar.objects import BaseOperation, SwarmNode
from swarmstar.objects.operations.action_operation import ActionOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation

instructor = Instructor()

class BaseAction(BaseModel):
    """
    All actions inherit this class.
    """
    __action_type__: ClassVar[ActionTypeEnum]
    node: SwarmNode
    operation: ActionOperation

    @abstractmethod
    def main(self) -> List[BaseOperation]:
        pass        

    async def report(self, report: str):
        if self.node.report is not None:
            raise ValueError(f"Node {self.node.id} already has a report: {self.node.report}. Cannot update with {report}.")
        self.node.report = report
        await self.node.upsert()

    """ Execution memory is for nodes to store information between actions """

    async def update_context(self, attribute: str, value: Any):
        self.node.context[attribute] = value
        await self.node.upsert()
    
    async def remove_context(self, attribute: str):
        del self.node.context[attribute]
        await self.node.upsert()

    async def clear_context(self):
        self.node.context = {}
        await self.node.upsert()

    async def update_termination_policy(self, termination_policy: TerminationPolicyEnum, termination_handler: str | None = None):
        """
        Some nodes have unique termination policies, and can define their own termination handlers.

        If the termination policy is custom_termination_handler, the termination handler will be set to the function name passed in the termination_handler parameter.
        """
        self.node.termination_policy = termination_policy
        await self.node.upsert()
        if termination_policy == "custom_termination_handler":
            await self.update_context("__termination_handler__", termination_handler)

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

    async def _ask_questions(self) -> Tuple[bool, SpawnOperation | None]:
        question_instructor_output = await Instructor.instruct(
            QuestionInstructor.generate_instruction(self.node.goal),
            QuestionInstructor,
            self.operation
        )
        if question_instructor_output.do_we_need_search:
            if question_instructor_output.questions is None:
                raise ValueError(f"QuestionInstructor returned None for questions despite do_we_need_search being True in swarm node {self.node.id} at operation {self.operation.id}")
            
            questions_string = "\t-" + "\n\t-".join(question_instructor_output.questions)
            return True, SpawnOperation(
                swarm_node_id=self.node.id,
                action_type=ActionTypeEnum.SEARCH,
                goal=f'Find answers to the following questions:\n{questions_string}',
                context=QuestionContext(
                    **self.operation.context, 
                    questions=question_instructor_output.questions
                ).model_dump()
            )
        else:
            return False, None
