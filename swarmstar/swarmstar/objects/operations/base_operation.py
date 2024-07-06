"""
Nodes can perform 1 of 5 "SwarmOperations":
    - SpawnOperation
    - ActionOperation
    - TerminationOperation
    - BlockingOperation
    - UserCommunicationOperation
"""
from __future__ import annotations
from typing import Any, Dict, Literal, Optional, Union
from pydantic import BaseModel, Field
from pydantic import ValidationError
from abc import ABC, abstractmethod

from swarmstar.swarmstar.enums.operation import OperationEnum
from swarmstar.swarmstar.objects.base_object import BaseObject
from swarmstar.utils.misc.ids import generate_id
from swarmstar.database import Database

db = Database()

class BaseOperation(BaseObject, ABC):
    id: str
    operation_type: OperationEnum
