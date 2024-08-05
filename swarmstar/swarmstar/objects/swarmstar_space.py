import uuid
from pydantic import Field
from typing import Dict, List
from swarmstar.constants.misc_constants import DEFAULT_SWARMSTAR_ID
from swarmstar.enums.database_table_enum import DatabaseTableEnum
from swarmstar.enums.swarm_status_enum import SwarmStatusEnum
from data.models.swarmstar_event_model import SwarmstarEventModel
from data.models.swarmstar_space_model import SwarmstarSpaceModel
from swarmstar.objects.base_object import BaseObject

from swarmstar.objects.trees.memory_metadata_tree import MemoryMetadataTree
from swarmstar.objects.trees.action_metadata_tree import ActionMetadataTree

from data.database import Database
from swarmstar.objects.trees.tool_metadata_tree import ToolMetadataTree

db = Database()

class SwarmstarSpace(BaseObject):
    """
    A comprehensive collection of all objects that constitute a swarm. 
    This includes nodes, metadata, operations, and other related entities, 
    encapsulating the entire state and behavior of the swarm.
    """
    table_enum = DatabaseTableEnum.SWARMSTAR_SPACE
    database_model_class = SwarmstarSpaceModel

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    total_event_count: int = 0
    action_count: int = 0
    action_metadata_node_count: int = 0
    memory_metadata_node_count: int = 0
    tool_metadata_node_count: int = 0
    spawn_operation_count: int = 0
    termination_operation_count: int = 0
    blocking_operation_count: int = 0
    communication_operation_count: int = 0
    function_call_operation_count: int = 0
    queued_operation_ids: List[str] = []
    goal: str
    swarm_title: str
    memory_title: str
    environment_vars: Dict[str, str] = {}
    status: SwarmStatusEnum

    @staticmethod
    async def instantiate(goal: str, swarm_title: str, memory_title: str) -> 'SwarmstarSpace':
        default_swarmstar_space = await SwarmstarSpace.read(DEFAULT_SWARMSTAR_ID)

        swarm = SwarmstarSpace(
            goal=goal,
            swarm_title=swarm_title,
            memory_title=memory_title,
            status=SwarmStatusEnum.ACTIVE,
            action_metadata_node_count=default_swarmstar_space.action_metadata_node_count,
            memory_metadata_node_count=default_swarmstar_space.memory_metadata_node_count,
            tool_metadata_node_count=default_swarmstar_space.tool_metadata_node_count,
        )

        await MemoryMetadataTree.clone(db, DEFAULT_SWARMSTAR_ID, swarm.id)
        await ActionMetadataTree.clone(db, DEFAULT_SWARMSTAR_ID, swarm.id)
        await ToolMetadataTree.clone(db, DEFAULT_SWARMSTAR_ID, swarm.id)

        return swarm

    @staticmethod
    async def delete_swarmstar_space(swarm_id: str):
        await MemoryMetadataTree.delete(db, swarm_id)
        await ActionMetadataTree.delete(db, swarm_id)
        await ToolMetadataTree.delete(db, swarm_id)

    @staticmethod
    def rollback_to_event(session, swarm_id: str, event_index: int):
        """
        Temporarily roll back the entire swarmstar space to the state at the specified event index.

        :param session: SQLAlchemy session
        :param swarm_id: The ID of the swarmstar space
        :param event_index: The event index to roll back to
        """
        # Rollback to the specified event
        history_entries = session.query(SwarmstarEventModel).filter_by(
            swarmstar_space_id=swarm_id
        ).order_by(SwarmstarEventModel.event_count).all()

        for entry in history_entries:
            if entry.event_count > event_index:
                break
            for key, value in entry.data.items():
                setattr(SwarmstarSpace, key, value)
        session.commit()


    @staticmethod
    def advance_to_present(session, swarm_id: str):
        """
        Restore the swarmstar space to its most recent state.

        :param session: SQLAlchemy session
        :param swarm_id: The ID of the swarmstar space
        """
        # Get the most recent state from the history
        history_entry = session.query(SwarmstarEventModel).filter_by(
            swarmstar_space_id=swarm_id
        ).order_by(SwarmstarEventModel.event_count.desc()).first()

        if history_entry:
            for key, value in history_entry.data.items():
                setattr(SwarmstarSpace, key, value)
        session.commit()
