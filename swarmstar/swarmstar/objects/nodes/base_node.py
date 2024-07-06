"""
Base class for nodes.

Swarm nodes, action metadata nodes and memory metadata nodes are all derived from this class.
"""
from pydantic import ConfigDict
from typing import List, Optional, TypeVar

from swarmstar.swarmstar.objects.base_object import BaseObject

T = TypeVar('T', bound='BaseNode')

class BaseNode(BaseObject):
    """ Base class for nodes. """
    id: str
    name: str
    type: str
    parent_id: Optional[str] = None
    children_ids: Optional[List[str]] = None
    model_config = ConfigDict(use_enum_values=True)
