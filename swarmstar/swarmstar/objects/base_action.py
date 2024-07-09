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
from typing import Any, List, Callable
from pydantic import BaseModel

from swarmstar.enums.action_type_enum import ActionTypeEnum
from swarmstar.enums.termination_policy_enum import TerminationPolicyEnum
from swarmstar.objects import BaseOperation, SwarmNode, ActionMetadata, SpawnOperation, BlockingOperation

class BaseAction(BaseModel):
    """
    All actions inherit this class.
    """
    node: SwarmNode
    action: ActionTypeEnum

    @abstractmethod
    def main(self) -> List[BaseOperation]:
        pass        

    def report(self, report: str):
        if self.node.report is not None:
            raise ValueError(f"Node {self.node.id} already has a report: {self.node.report}. Cannot update with {report}.")
        self.node.report = report
        SwarmNode.update(self.node.id, {'report': report})

    """ Execution memory is for nodes to store information between actions """

    def update_context(self, attribute: str, value: Any):
        self.node.context[attribute] = value
        SwarmNode.update(self.node.id, {'context': self.node.context})
    
    def remove_context(self, attribute: str):
        del self.node.context[attribute]
        SwarmNode.update(self.node.id, {'context': self.node.context})

    def clear_context(self):
        self.node.context = {}
        SwarmNode.update(self.node.id, {'context': {}})

    def update_termination_policy(self, termination_policy: TerminationPolicyEnum, termination_handler: str | None = None):
        """
        Some nodes have unique termination policies, and can define their own termination handlers.

        If the termination policy is custom_termination_handler, the termination handler will be set to the function name passed in the termination_handler parameter.
        """
        self.node.termination_policy = termination_policy
        SwarmNode.update(self.node.id, {'termination_policy': termination_policy})
        if termination_policy == "custom_termination_handler":
            self.update_context("__termination_handler__", termination_handler)

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
            instructor_model_name = kwargs.pop("instructor_model_name", None)

            if not instructor_model_name or not completion:
                raise ValueError(f"instructor_model_name and completion are required parameters for receive_instructor_completion_handler. Error in {self.node.id} at function {func.__name__}")

            if type(completion) is dict and instructor_model_name:
                models_module = ActionMetadata.get_action_module(self.node.type)
                instructor_model = getattr(models_module, instructor_model_name)
                completion = instructor_model.model_validate(completion)

            if context:
                return func(self, completion, context)
            else:
                return func(self, completion)
        return wrapper

    @staticmethod
    def ask_questions_wrapper(func: Callable):
        """        
        The wrapped function needs to accept:
            - message: str
            - context: Optional[Dict[str, Any]]
        
        The message should be a directive, decision or task. This wrapper will force an additional step,
        to ask questions, before the wrapped function is called. This is to ensure that the LLM has
        full context before performing any action. Questions are answered by the oracle.

        The oracle is responsible for answering questions and has access to the swarm's memory,
        the internet, and can communicate with the user as a last resort. 
    
        This abstracts the RAG problem away from actions. To ensure any action is performed
        with full context, we tell the LLM to ask questions. The answering of these questions
        is the oracle's responsibility.

        Functionality:
        This wrapper will be called multiple times, and at each step will be in one of the following stages.
        This wrapper will know which stage it is in by checking the received parameters.

        1. Giving the LLM the option to ask questions:
            Expected parameters: message: str, Optional[context: Dict[str, Any]]
        - Saves original message in operational context
        - Returns a Blocking Operation of type "ask_questions" with the message and context.

        2. Accessing the oracle:
            Expected parameters: (completion: Any, context: Dict[str, Any])
        - Checks if the `questions` field in the completion is None.
        - If the `questions` field in the completion is None, call the wrapped function.
        - If not None, spawns an oracle node to answer the questions and set 
        this node's termination handler to the wrapped function so that we can
        handle the oracle's response.

        3. Handling the oracle's completion:
            Expected parameters: (terminator_id: str, context: Dict[str, Any])
        - Appends the report from the oracle node to the message in context.
        - Returns a Blocking Operation of type "ask_questions" with the message and context.
 
        This process repeats until the LLM has no more questions.
        """
        @wraps(func)
        def wrapper(self, **kwargs):
            message = kwargs.pop("message", None)
            context = kwargs.pop("context", None)
            completion = kwargs.get("completion", None)
            if type(completion) is not dict and completion: completion = completion.model_dump()
            terminator_id = kwargs.get("terminator_id", None)
            
            if message: # Stage 1
                if context is None: context = {}
                context["__message__"] = message
                return BlockingOperation(
                    node_id=self.node.id,
                    blocking_type="ask_questions",
                    args={"message": message},
                    context=context,
                    next_function_to_call=func.__name__
                )
            elif completion: # Stage 2
                if completion["questions"]:
                    self.update_termination_policy(termination_policy="custom_termination_handler", termination_handler=func.__name__)
                    return SpawnOperation(
                        parent_id=self.node.id,
                        action_id="specific/oracle",
                        message={
                            "questions": completion["questions"], 
                            "context": completion["context"]
                        },
                        context=context
                    )
                else:
                    message = context.pop("__message__")
                    if context: return func(self, message, context)
                    else: return func(self, message)
            elif terminator_id: # Stage 3
                terminator_node = SwarmNode.read(terminator_id)
                oracle_report = terminator_node.report
                context["__message__"] += f"\n\n{oracle_report}"
                return BlockingOperation(
                    node_id=self.node.id,
                    blocking_type="ask_questions",
                    args={"message": message},
                    context=context,
                    next_function_to_call=func.__name__
                )
            else:
                raise ValueError(f"ask_questions wrapper called with invalid parameters: {kwargs}")
        return wrapper


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