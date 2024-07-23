from abc import ABC
from pydantic import BaseModel

class BaseContext(BaseModel, ABC):
    pass
