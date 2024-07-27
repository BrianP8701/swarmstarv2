from httpx import get
from pydantic import BaseModel
from abc import ABC
from typing import ClassVar, List
import asyncio
from sqlalchemy.orm import aliased
from sqlalchemy import select

from data.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.constants.database_constants import TABLE_ENUM_TO_ABBREVIATION
from swarmstar.objects.nodes.base_node import BaseNode
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.utils.misc.ids import get_all_swarm_object_ids

class BaseTree(ABC, BaseModel):
    """
    We use trees quite a lot in swarmstar. The actual swarm's nodes are stored in a tree.
    Action and memory metadata are stored in a tree. The tree is a very useful data structure for
    organizing data in a way that's easy to traverse and understand. It's also naturally
    efficient and scalable.
    """
    __table_enum__: ClassVar[DatabaseTableEnum]
    __node_model_class__: ClassVar[BaseSQLAlchemyModel]
    __node_class__: ClassVar[BaseNode]

    @classmethod
    def get_root_node_id(cls, swarm_id: str) -> str:
        return f"{swarm_id}_{TABLE_ENUM_TO_ABBREVIATION[cls.__table_enum__]}0"

    @classmethod
    async def get_all_node_ids(cls, swarm_id: str) -> List[str]:
        return await get_all_swarm_object_ids(swarm_id, cls.__table_enum__) or []

    @classmethod
    async def read_tree(cls, swarm_id: str) -> List[BaseNode]:
        """ Reads the tree from the database and returns the root node with all children. """
        all_node_ids = await cls.get_all_node_ids(swarm_id)
        return await cls.__node_class__.batch_read(all_node_ids)

    @classmethod
    async def delete(cls, swarm_id: str) -> None:
        """ Deletes every node in the tree from the database. """        
        await cls.__node_class__.batch_delete(await cls.get_all_node_ids(swarm_id))

    @classmethod
    async def clone(cls, old_swarm_id: str, swarm_id: str) -> None:
        """ Clones every node in the tree under a new swarm id in the database. """
        root_node = await cls.read_tree(old_swarm_id)

        batch_copy_payload = [[], []]  # [old_ids, new_ids]
        batch_update_payload = []  # {new_id: {parent_id: "", children_ids: []}}

        def update_node_ids(node):
            old_id = node.id
            parts = node.id.split("_", 1)
            node.id = f"{swarm_id}_{parts[1]}"
            if node.parent_id:
                parts = node.parent_id.split("_", 1)
                node.parent_id = f"{swarm_id}_{parts[1]}"
            if node.children_ids:
                for i, child_id in enumerate(node.children_ids):
                    parts = child_id.split("_", 1)
                    node.children_ids[i] = f"{swarm_id}_{parts[1]}"
            batch_copy_payload[0].append(old_id)
            batch_copy_payload[1].append(node.id)
            batch_update_payload.append({"id": node.id, "parent_id": node.parent_id, "children_ids": node.children_ids})
            for child in node.children:
                update_node_ids(child)

        update_node_ids(root_node)

        if batch_copy_payload:
            await cls.__node_class__.batch_copy(batch_copy_payload[0], batch_copy_payload[1])
        if batch_update_payload:
            await cls.__node_class__.batch_update(batch_update_payload)
