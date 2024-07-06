from pydantic import Field
from typing import Literal, Dict, Any, Union, Optional

from swarmstar.swarmstar.objects.operations.base_operation import BaseOperation

class BlockingOperation(BaseOperation):
    operation_type: Literal["blocking"] = Field(default="blocking")
    node_id: str
    blocking_type: Literal[
        "instructor_completion",
        "openai_completion",
        "ask_questions",
    ]
    args: Dict[str, Any] = {}
    context: Dict[str, Any] = {}
    next_function_to_call: str


class SpawnOperation(BaseOperation):
    operation_type: Literal["spawn"] = Field(default="spawn")
    action_id: str
    message: Union[str, Dict[str, Any]]
    context: Optional[Dict[str, Any]] = {}
    parent_id: Optional[str] = None
    node_id: Optional[str] = None


class ActionOperation(BaseOperation):
    operation_type: Literal["action"] = Field(default="action")
    function_to_call: str
    node_id: str
    args: Dict[str, Any] = {}


class TerminationOperation(BaseOperation):
    operation_type: Literal["terminate"] = Field(default="terminate")
    terminator_id: str
    node_id: str
    context: Optional[Dict[str, Any]] = None


class CommunicationOperation(BaseOperation):
    operation_type: Literal["communication"] = Field(default="communication")
    node_id: str
    message: str
    context: Optional[Dict[str, Any]] = {}
    next_function_to_call: str
