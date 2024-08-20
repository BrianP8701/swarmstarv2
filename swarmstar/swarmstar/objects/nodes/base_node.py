from abc import ABC
from typing import ClassVar, Generic, List, Optional, Type, TypeVar

from swarmstar.objects.base_object import BaseObject

T = TypeVar("T", bound="BaseNode")


class BaseNode(BaseObject[T], Generic[T], ABC):
    """Base class for nodes."""

    swarm_id: str
    title: ClassVar[str]
    parent_id: Optional[str] = None
    children_ids: ClassVar[List[str]] = []

    async def get_parent(self: T) -> Optional[T]:
        if self.parent_id:
            return await self.read(self.parent_id)
        return None

    async def get_children(self: T) -> List[T]:
        if self.children_ids:
            return await self.batch_read(self.children_ids)
        return []
