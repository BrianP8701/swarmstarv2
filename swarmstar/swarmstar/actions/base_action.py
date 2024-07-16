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
from ast import Dict
from functools import wraps
from typing import Any, List, Callable, Optional
from pydantic import BaseModel
from swarmstar.constants import INSTRUCTOR_MODEL_TITLE_TO_CLASS

from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.objects import BaseOperation, SwarmNode
from swarmstar.objects.nodes.action_metadata_node import ActionMetadataNode
from swarmstar.objects.operations.action_operation import ActionOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation

class BaseAction(BaseModel):
    """
    All actions inherit this class.
    """
    node: SwarmNode
    action: ActionTypeEnum

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
    def receive_instructor_completion_handler(func: Callable):
        @wraps(func)
        def wrapper(self, **kwargs):
            """
            This wrapper is used on any action function that is meant 
            to handle the completion of an instructor_completion.
            
            The function should accept two parameters as keyword arguments:
                - completion: The completion of the instructor_completion of type defined by the instructor_model_name
                - context: Context persisted through the blocking operation. Optional.
            
            (Skip this if not interested)
            In an action we'll output a blocking operation. When this operation is executed, it'll
            return an action operation with the response. Instructor completions return a response
            following the specified Pydantic model. However, if we pause the swarm, the action operation
            will get serialized, converting the completion into a dictionary. This wrapper merely ensures
            that the completion is converted back into the Pydantic model before being passed to the function
            in case of this scenario.
            """
            completion = kwargs.get("completion", None)
            context = kwargs.get("context", None)
            instructor_model_title = kwargs.pop("instructor_model_title", None)

            if not instructor_model_title or not completion:
                raise ValueError(f"instructor_model_name and completion are required parameters for receive_instructor_completion_handler. Error in {self.node.id} at function {func.__name__}")

            if type(completion) is dict and instructor_model_title:
                instructor_model = INSTRUCTOR_MODEL_TITLE_TO_CLASS[instructor_model_title]
                completion = instructor_model.model_validate(completion)

            if context:
                return func(self, completion, context)
            else:
                return func(self, completion)
        return wrapper

    @staticmethod
    async def ask_questions_wrapper(func: Callable[[str, Optional[dict[str, Any]]], Any]):
        """
        The wrapped function needs to accept:
            - goal: str
            - context: Optional[Dict[str, Any]]

        This wrapper abstracts search away from actions.

        1. Give the LLM the option to ask questions:
            Expected parameters: goal: str, Optional[context: Dict[str, Any]]
        - Saves original payload in operational context
        - Allows an LLM to ask questions for more context before performing an action.
        - Returns a Search ActionOperation if questions are asked.
        - Calls the function normally if questions are not asked.

        2. If the LLM asks questions, spawn a Search node to answer them:
            Expected parameters: (completion: Any, context: Dict[str, Any])
        - Checks if the `questions` field in the completion is None.
        - If the `questions` field in the completion is None, call the wrapped function.
        - If not None, spawns a search node to answer the questions and set 
        this node's termination handler to the wrapped function so that we can
        handle the search node's response.

        3. Receive the search result and resume the original action:
            Expected parameters: (terminator_id: str, context: Dict[str, Any])
        - Appends the report from the search node to the message in context.
        - Returns a Blocking Operation of type "ask_questions" with the message and context.
 
        This process repeats until the LLM has no more questions.
        """
        @wraps(func)
        async def wrapper(self, **kwargs):
            message = kwargs.pop("message", None)
            context = kwargs.pop("context", None)
            completion = kwargs.get("completion", None)
            if type(completion) is not dict and completion: completion = completion.model_dump()
            terminator_id = kwargs.get("terminator_id", None)
            
            if message: # Stage 1
                if context is None: context = {}
                context["__message__"] = message
                return ActionOperation(
                    swarm_node_id=self.node.id,
                    function_to_call="ask_questions",
                    args={"message": message},
                    context=context,
                )
            elif completion: # Stage 2
                if completion["questions"]:
                    self.update_termination_policy(termination_policy="custom_termination_handler", termination_handler=func.__name__)
                    return SpawnOperation(
                        swarm_node_id=self.node.id,
                        action_type=ActionTypeEnum.SEARCH,
                        goal=f"{completion['questions']}\n\n{completion['context']}",
                        context=context
                    )
                else:
                    message = context.pop("__message__")
                    return func(message, context)
            elif terminator_id: # Stage 3
                terminator_node = await SwarmNode.read(terminator_id)
                oracle_report = terminator_node.report
                context["__message__"] += f"\n\n{oracle_report}"
                return ActionOperation(
                    swarm_node_id=self.node.id,
                    context=context,
                    function_to_call=func.__name__,
                    args={"message": message},
                )
            else:
                raise ValueError(f"ask_questions wrapper called with invalid parameters: {kwargs}")
        return wrapper

    async def _

# Look at this again later # TODO for some reason its repeating stuff and outputs a ton of shit
# def error_handling_decorator(func):
#     @wraps(func)
#     def wrapper(self, *args, **kwargs):
#         try:
#             return func(self, *args, **kwargs)
#         except Exception as e:
#             exc_type, exc_value, exc_traceback = sys.exc_info()
#             traceback_str = ''.join(traceback.format_exception(exc_type, exc_value, exc_traceback))
            
#             # Capture local variables
#             frame = inspect.trace()[-1][0]
#             local_vars = frame.f_locals
            
#             error_details = {
#                 'exc_type': exc_type.__name__,
#                 'exc_value': str(exc_value),
#                 'exc_traceback': traceback_str,
#                 'local_variables': {key: repr(value) for key, value in local_vars.items()},
#                 'error_line': frame.f_lineno,
#                 'error_module': frame.f_code.co_filename
#             }
            
#             error_message = (
#                 f"Error in {func.__name__}:\n{str(e)}\n\n"
#                 f"Traceback:\n{traceback_str}\n\n"
#                 f"Local Variables:\n{json.dumps(error_details['local_variables'], indent=2)}"
#             )
            
#             raise ValueError(error_message)
#             # return SpawnOperation(
#             #     parent_id=self.node.id,
#             #     node_embryo=NodeEmbryo(
#             #         action_id="swarmstar/actions/swarmstar/handle_failure",
#             #         message=error_message,
#             #         context={'error_details': error_details}
#             #     )
#             # )
    
#     return wrapper