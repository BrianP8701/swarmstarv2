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

from swarmstar.swarmstar.enums.operations import OperationEnum
from swarmstar.utils.misc.ids import get_available_id
from swarmstar.database import Database
from swarmstar.constants import operation_enum_to_class, operation_enum_to_model

db = Database()

class SwarmOperation(BaseModel, ABC):
    id: Optional[str] = Field(default_factory=lambda: get_available_id("swarm_operations"))
    operation_type: OperationEnum

    def create(self) -> None:
        db.create(operation_enum_to_model[self.operation_type](**self.model_dump()))

    @staticmethod
    def upsert(operation: SwarmOperation) -> None:
        db.upsert(operation_enum_to_model[operation.operation_type](**operation.model_dump()))

    @staticmethod
    def read(operation_id: str) -> SwarmOperation:
        operation = db.read("swarm_operations", operation_id)
        return operation_enum_to_class[operation["operation_type"]](**operation)

    @staticmethod
    def delete(operation_id: str) -> None:
        db.delete("swarm_operations", operation_id)
