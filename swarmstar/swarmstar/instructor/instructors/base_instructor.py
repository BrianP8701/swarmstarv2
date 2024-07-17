from abc import ABC, abstractmethod
from typing import List
from pydantic import BaseModel
from swarmstar.objects.message import Message

class BaseInstructor(ABC, BaseModel):

    @abstractmethod
    @staticmethod
    def generate_instruction(**kwargs) -> List[Message]:
        pass
    