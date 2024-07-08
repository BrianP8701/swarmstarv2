from httpx import get
from pydantic import BaseModel
from abc import ABC
from typing import ClassVar, List
import asyncio
from sqlalchemy.orm import aliased
from sqlalchemy import select

from swarmstar.models.base_sqlalchemy_model import BaseSQLAlchemyModel
from swarmstar.objects.nodes.base_node import BaseNode
from swarmstar.constants import TABLE_ENUM_TO_ABBREVIATION
from swarmstar.enums.database_table import DatabaseTable
from swarmstar.utils.misc.ids import get_all_swarm_object_ids

class BaseTree(ABC, BaseModel):
    """
    We use trees quite a lot in swarmstar. The actual swarm's nodes are stored in a tree.
    Action and memory metadata are stored in a tree. The tree is a very useful data structure for
    organizing data in a way that's easy to traverse and understand. It's also naturally
    efficient and scalable.
    """
    __table__: ClassVar[DatabaseTable]
    __node_model__: ClassVar[BaseSQLAlchemyModel]
    __node_object__: ClassVar[BaseNode]

    @classmethod
    def get_root_node_id(cls, swarm_id: str) -> str:
        return f"{swarm_id}_{TABLE_ENUM_TO_ABBREVIATION[cls.__table__]}0"

    @classmethod
    async def read_tree(cls, swarm_id: str) -> BaseNode:
        """ Reads the tree from the database and returns the root node with all children. """
        root_node_id = cls.get_root_node_id(swarm_id)
        
        # Define the recursive CTE
        node_alias = aliased(cls.__node_model__)
        cte = (
            select(node_alias)
            .where(node_alias.id == root_node_id)
            .cte(name="node_cte", recursive=True)
        )

        cte = cte.union_all(
            select(node_alias)
            .join(cte, node_alias.parent_id == cte.c.id)
        )

        # Execute the query
        query = select(cte)
        result = await cls.__node_model__.execute(query)

        # Convert the result to a tree structure
        nodes = {row.id: BaseNode(**row._asdict()) for row in result}
        for node in nodes.values():
            if node.parent_id:
                nodes[node.parent_id].children.append(node)
                node.parent = nodes[node.parent_id]

        return nodes[root_node_id]

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
            await cls.__node_object__.batch_copy(batch_copy_payload[0], batch_copy_payload[1])
        if batch_update_payload:
            await cls.__node_object__.batch_update(batch_update_payload)

    @classmethod
    async def delete(cls, swarm_id: str) -> None:
        """ Deletes every node in the tree from the database. """        
        batch_delete_payload = await get_all_swarm_object_ids(swarm_id, cls.__table__)
        
        if batch_delete_payload:
            await cls.__node_object__.batch_delete(batch_delete_payload)
