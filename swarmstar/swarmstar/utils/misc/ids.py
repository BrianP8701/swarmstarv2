"""
For simplicity, swarm nodes, operation, memory and action metadata have ids like:

    {swarm_id}_{x}{y}

Where x represents the node's collection, and y represents the node's index within that collection.
"""
import re
import uuid

from swarmstar.database import Database
from swarmstar.swarmstar.enums.database_collection import DatabaseCollection
from swarmstar.swarmstar.constants import collection_to_identifier, collection_to_swarmstar_space_count_column
from swarmstar.swarmstar.models.swarmstar_space import SwarmstarSpaceModel

db = Database()

def generate_id(collection: DatabaseCollection, swarm_id: str | None = None) -> str:
    """
    SwarmstarSpace uses uuidv4()
    All other models follow the schema:
    {swarm_id}_{collection}_{x}
    """
    if collection == DatabaseCollection.SWARMSTAR_SPACE:
        return uuid.uuid4().hex
    if swarm_id is None:
        raise ValueError(f"swarm_id is required to create an id for {collection}")
    identifier = collection_to_identifier[collection]
    count_column_name = collection_to_swarmstar_space_count_column[collection]
    with db.get_session() as session:
        x = db.select(SwarmstarSpaceModel, swarm_id, [count_column_name], session)[count_column_name]
        db.update(SwarmstarSpaceModel, swarm_id, {count_column_name: (x + 1)}, session)
    return f"{swarm_id}_{identifier}{x}"

def extract_swarm_id(full_id: str) -> str:
    match = re.match(r"^(.*)_[a-z]\d+$", full_id)
    if match:
        return match.group(1)
    return full_id
