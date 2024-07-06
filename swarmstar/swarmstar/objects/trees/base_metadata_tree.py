"""
Think of a metadata tree as a file system, where files and folders
are all labeled with descriptions and other metadata.

In swarmstar we have two metadata trees: action and memory. 
This allows us to find actions to take, and answers to questions.
"""
from swarmstar.swarmstar.objects.trees.base_tree import BaseTree
from swarmstar.database.internal import get_internal_sqlite
from swarmstar.database import Database
db = Database()

class MetadataTree(BaseTree):
    @classmethod
    def instantiate(cls, swarm_id: str) -> None:
        """
        Only call this once when a swarm instance is created.
        
        Swarmstar comes with a default action and memory metadata tree. When 
        a swarm instance is created, it'll need to be able to access the default 
        action and memory metadata tree but also be able to dynamically add 
        actions and memories. 
        
        It would be wasteful to copy the entire default action and memory 
        metadata tree each time, as they're immutable. Rather, a select 
        few nodes, coined "portal nodes", which are folder nodes where we may 
        attach connections to external nodes, will be cloned.
        
        Skip this if not interested in the details:
        Portal nodes are the internal nodes that we want to be able to add
        external node ids to. However we can't change internal nodes. Portal nodes
        are stored in the internal sqlite database like all other internal nodes. But
        in this instantiation process, each of them will be cloned and stored in the
        external database with id {swarm_id}_{node_id}. This way, we can add external
        node ids to the cloned portal nodes without changing the original internal nodes.
        And whenever we see a portal node, we'll know, just prepend the swarm_id and check
        the external database.
        """
        print(f"Instantiating {cls.__table__} tree for swarm {swarm_id}...")
        
        internal_root_node_id = "root"
        node = get_internal_sqlite(cls.__table__, internal_root_node_id)

        batch_create_payload = {} # {new_node_id: new_node}

        def recursive_helper(node):
            if "type" in node and node.get("portal", False):
                node_id = f"{swarm_id}_{node['id']}"
                batch_create_payload[node_id] = node
            if node.get("children_ids", None):
                for child_id in node["children_ids"]:
                    child_node = get_internal_sqlite(cls.__table__, child_id)
                    recursive_helper(child_node)

        recursive_helper(node)

        if batch_create_payload: db.batch_create(cls.__table__, batch_create_payload)
