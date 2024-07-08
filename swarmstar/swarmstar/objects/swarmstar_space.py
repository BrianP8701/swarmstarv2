"""
Swarmstar space describes the entirety of what makes up a swarm: 
    - Swarm nodes
    - Swarm operations
    - Memory tree
    - Action tree
The SwarmstarSpace class provides a high level interface to instantiate,
clone and delete swarmstar spaces.

Every object in the swarmstar space follows a common format for their ids
    {swarm_id}_{x}{y}
where x is a marker for the type of object:
    - sn: swarm node
    - to: termination operation
    - so: spawn operation
    - bo: blocking operation
    - co: communication operation
    - ao: action operation
    - mm: memory
    - am: action
and y is simply the number, taken in order of creation

This id convention makes it easier to manage everything
"""
from contextlib import contextmanager
import uuid
from pydantic import Field
from typing import Dict, List
from swarmstar.enums.database_table_enum import DatabaseTable
from swarmstar.models.swarmstar_event_model import SwarmstarEventModel
from swarmstar.models.swarmstar_space_model import SwarmstarSpaceModel
from swarmstar.objects.base_object import BaseObject

from swarmstar.objects.trees.memory_metadata_tree import MemoryMetadataTree
from swarmstar.objects.trees.action_metadata_tree import ActionMetadataTree
from swarmstar.objects.trees.swarm_tree import SwarmTree
from swarmstar.objects.operations.base_operation import BaseOperation

from swarmstar.database import Database

db = Database()

class SwarmstarSpace(BaseObject):
    __table__ = DatabaseTable.SWARMSTAR_SPACE
    __object_model__ = SwarmstarSpaceModel

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    total_event_count: int = 0
    swarm_node_count: int = 0
    action_metadata_node_count: int = 0
    memory_metadata_node_count: int = 0
    spawn_operation_count: int = 0
    termination_operation_count: int = 0
    blocking_operation_count: int = 0
    communication_operation_count: int = 0
    action_operation_count: int = 0
    queued_operation_ids: List[str] = []
    goal_id: str
    swarm_title: str
    memory_title: str
    environment_vars: Dict[str, str] = {}
    active: bool = True

    @classmethod
    def instantiate_swarmstar_space(cls, swarm_id: str):
        if cls.exists(swarm_id):
            raise ValueError(f"Swarmstar space with id {swarm_id} already exists")

        swarmstar_space = cls(
            
        )

        MemoryMetadataTree.instantiate(swarm_id)
        ActionMetadataTree.instantiate(swarm_id)

        cls.create()

    @staticmethod
    def delete_swarmstar_space(swarm_id: str):
        if not db.exists("admin", swarm_id):
            raise ValueError(f"Swarmstar space with id {swarm_id} does not exist")

        swarmstar_space = SwarmstarSpace.read(swarm_id)
        db.delete("admin", swarm_id)
        
        if swarmstar_space.node_count > 0: SwarmTree.delete(swarm_id)
        if swarmstar_space.action_count > 0: ActionMetadataTree.delete(swarm_id)
        if swarmstar_space.memory_count > 0: MemoryMetadataTree.delete(swarm_id)
        
        for i in range(swarmstar_space.operation_count):
            BaseOperation.delete(f"{swarm_id}_o{i}")

    @staticmethod
    @contextmanager
    def rollback_to_event(session, swarm_id: str, event_index: int):
        """
        Temporarily roll back the swarmstar space to the state at the specified event index.

        :param session: SQLAlchemy session
        :param swarm_id: The ID of the swarmstar space
        :param event_index: The event index to roll back to
        """
        # Save the current state
        current_state = SwarmstarSpace.read(swarm_id).__dict__.copy()

        try:
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
            yield
        finally:
            # Restore the most recent state
            for key, value in current_state.items():
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
