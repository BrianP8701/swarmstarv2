from typing import List, Optional, TypeVar, Generic

from swarmstar.objects.base_object import BaseObject

T = TypeVar('T', bound='BaseNode')

class BaseNode(BaseObject, Generic[T]):
    """ Base class for nodes. """
    name: str
    parent_id: Optional[str] = None
    children_ids: List[str] = []

    children: List[T] = []
    parent: Optional[T] = None

    async def get_parent(self) -> Optional[T]:
        if self.parent_id:
            return await self.read(self.parent_id)
        return None

    async def get_children(self) -> List[T]:
        if self.children_ids:
            return await self.batch_read(self.children_ids)
        return []
