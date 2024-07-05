from pydantic import Field
from typing import Literal, Dict, Any, Union, Optional

from swarmstar.swarmstar.types.swarm.swarm_operation import SwarmOperation

class BlockingOperation(SwarmOperation):
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


class SpawnOperation(SwarmOperation):
    operation_type: Literal["spawn"] = Field(default="spawn")
    action_id: str
    message: Union[str, Dict[str, Any]]
    context: Optional[Dict[str, Any]] = {}
    parent_id: Optional[str] = None
    node_id: Optional[str] = None


class ActionOperation(SwarmOperation):
    operation_type: Literal["action"] = Field(default="action")
    function_to_call: str
    node_id: str
    args: Dict[str, Any] = {}


class TerminationOperation(SwarmOperation):
    operation_type: Literal["terminate"] = Field(default="terminate")
    terminator_id: str
    node_id: str
    context: Optional[Dict[str, Any]] = None


class UserCommunicationOperation(SwarmOperation):
    operation_type: Literal["user_communication"] = Field(default="user_communication")
    node_id: str
    message: str
    context: Optional[Dict[str, Any]] = {}
    next_function_to_call: str
