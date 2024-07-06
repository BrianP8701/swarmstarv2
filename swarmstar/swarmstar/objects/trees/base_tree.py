from pydantic import BaseModel
from abc import ABC

from swarmstar.database import Database
from swarmstar.swarmstar.objects.nodes.base_node import BaseNode
from swarmstar.constants import TABLE_ENUM_TO_ABBREVIATION, TABLE_ENUM_TO_MODEL_CLASS
from swarmstar.swarmstar.enums.database_table import DatabaseTable

db = Database()

class BaseTree(ABC, BaseModel):
    """
    We use trees quite a lot in swarmstar. The actual swarm's nodes are stored in a tree.
    Action and memory metadata are stored in a tree. The tree is a very useful data structure for
    organizing data in a way that's easy to traverse and understand. It's also naturally
    efficient and scalable.
    """
    __table__: DatabaseTable

    @classmethod
    def get_root_node_id(cls, swarm_id: str) -> str:
        return f"{swarm_id}_{TABLE_ENUM_TO_ABBREVIATION[cls.__table__]}0"

    @classmethod
    def clone(cls, old_swarm_id: str, swarm_id: str) -> None:
        """ Clones every node in the tree under a new swarm id in the database. """
        root_node_id = cls.get_root_node_id(old_swarm_id)

        batch_copy_payload = [[], []] # [old_ids, new_ids]
        batch_update_payload = [] # {new_id: {parent_id: "", children_ids: []}} 

        def recursive_helper(node_id):
            node = BaseNode.read(node_id)

            if node.children_ids:
                for i, child_id in enumerate(node.children_ids):
                    recursive_helper(child_id)
                    parts = child_id.split("_", 1)
                    node.children_ids[i] = f"{swarm_id}_{parts[1]}"

            old_id = node.id
            parts = node.id.split("_", 1)
            node.id = f"{swarm_id}_{parts[1]}"
            # If the node has a parent and is not a portal node, change the parent id
            if node.parent_id:
                parts = node.parent_id.split("_", 1)
                node.parent_id = f"{swarm_id}_{parts[1]}"
            batch_copy_payload[0].append(old_id)
            batch_copy_payload[1].append(node.id)
            batch_update_payload.append({"id": node.id, "parent_id": node.parent_id, "children_ids": node.children_ids})

        recursive_helper(root_node_id)

        if batch_copy_payload:
            db.batch_copy(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], batch_copy_payload[0], batch_copy_payload[1])
        if batch_update_payload:
            db.batch_update(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], batch_update_payload)

    @classmethod
    def delete(cls, swarm_id: str) -> None:
        """ Deletes every node in the tree from the database. """
        root_node_id = cls.get_root_node_id(swarm_id)
        
        batch_delete_payload = []
        
        def recursive_helper(node_id):
            node = BaseNode.read(node_id)
            if node.children_ids:
                for child_id in node.children_ids:
                    batch_delete_payload.append(node.id)
                    recursive_helper(child_id)

        recursive_helper(root_node_id)
        
        if batch_delete_payload:
            db.batch_delete(TABLE_ENUM_TO_MODEL_CLASS[cls.__table__], batch_delete_payload)
