"""
Base class for nodes.

Swarm nodes, action metadata nodes and memory metadata nodes are all derived from this class.
"""
from pydantic import BaseModel, Field, ConfigDict
from typing import Dict, List, Optional, Any, Type, TypeVar

from swarmstar.database import Database
from swarmstar.constants import collection_to_model

db = Database()

T = TypeVar('T', bound='BaseNode')

class BaseNode(BaseModel):
    """ Base class for nodes. """
    id: str
    name: str
    type: str
    parent_id: Optional[str] = None
    children_ids: Optional[List[str]] = None
    collection: str = Field(exclude=True)  # Collection name in the database
    model_config = ConfigDict(use_enum_values=True)

    def create(self) -> None:
        db.create(collection_to_model[self.collection](**self.model_dump()))

    @classmethod
    def read(cls: Type[T], node_id: str) -> T:
        node_dict = db.read(collection_to_model[cls.collection], node_id)
        return cls(**node_dict)

    @classmethod
    def update(cls, node_id: str, data: Dict[str, Any]) -> None:
        db.update(collection_to_model[cls.collection], node_id, data)

    @classmethod
    def delete(cls, node_id: str) -> None:
        db.delete(collection_to_model[cls.collection], node_id)

    def upsert(self) -> None:
        db.upsert(collection_to_model[self.collection](**self.model_dump()))
