"""
Base class for nodes.

Swarm nodes, action metadata nodes and memory metadata nodes are all derived from this class.
"""
from pydantic import Field, ConfigDict
from typing import Dict, List, Optional, Any, Type, TypeVar

from swarmstar.database import Database
from swarmstar.constants import collection_to_model
from swarmstar.swarmstar.enums.database_collection import DatabaseCollection
from swarmstar.swarmstar.objects.base_object import BaseObject

db = Database()

T = TypeVar('T', bound='BaseNode')

class BaseNode(BaseObject):
    """ Base class for nodes. """
    id: str
    name: str
    type: str
    parent_id: Optional[str] = None
    children_ids: Optional[List[str]] = None
    collection: DatabaseCollection = Field(exclude=True)  # Collection name in the database
    model_config = ConfigDict(use_enum_values=True)
