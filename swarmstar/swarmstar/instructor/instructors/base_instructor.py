from abc import ABC, abstractmethod
from typing import ClassVar, List
from pydantic import BaseModel
from swarmstar.instructor.instructor_client import InstructorClient
from swarmstar.objects.message import Message

class BaseInstructor(ABC, BaseModel):
    client: ClassVar[InstructorClient] = InstructorClient()

    @abstractmethod
    @staticmethod
    def write_instructions(**kwargs) -> List[Message]:
        pass

    @abstractmethod
    @staticmethod
    def write_content(**kwargs) -> str:
        pass
