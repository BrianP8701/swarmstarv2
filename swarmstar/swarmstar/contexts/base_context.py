from abc import ABC
from typing import Optional
from pydantic import BaseModel


class BaseContext(BaseModel, ABC):
    __memory_node_id__: Optional[str] = None