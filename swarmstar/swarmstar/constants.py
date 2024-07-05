from swarmstar.swarmstar.models.swarm_node import SwarmNodeModel

node_to_identifier = {
    "swarm_nodes": "s",
    "action_metadata_nodes": "a",
    "memory_metadata_nodes": "m"
}

collection_to_model = {
    "swarm_nodes": SwarmNodeModel,
    # "action_metadata_nodes": ActionMetadataNodeModel,
    # "memory_metadata_nodes": MemoryMetadataNodeModel
}