"""
For simplicity, swarm nodes, operation, memory and action metadata have ids like:

    {swarm_id}_{x}

Where x represents the number of the node of that type.
"""
from swarmstar.database import Database

db = Database()

def get_available_id(collection: str) -> str:
    swarm_id = swarm_id_var.get()
    x = db.get(collection, swarm_id)["count"]
    db.update(collection, swarm_id, {"count": x + 1})
    return f"{swarm_id}_{x}"

def get_x_given_collection(collection: str) -> str:
    if collection == "swarm_nodes": return "n"
    elif collection == "swarm_operations": return "o"
    elif collection == "memory_metadata": return "m"
    elif collection == "action_metadata": return "a"
    else: raise ValueError(f"Collection {collection} not recognized.")
