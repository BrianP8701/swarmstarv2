from abc import ABC, abstractmethod
from typing import ClassVar, List
from pydantic import BaseModel

from swarmstar.objects.message import Message

class BaseInstructor(ABC, BaseModel):
    @classmethod
    def get_client(cls):
        from swarmstar.instructors.instructor_client import InstructorClient
        return InstructorClient()

    @staticmethod
    @abstractmethod
    def write_instructions(**kwargs) -> List[Message]:
        pass

    @staticmethod
    @abstractmethod
    def write_content(**kwargs) -> str:
        pass
