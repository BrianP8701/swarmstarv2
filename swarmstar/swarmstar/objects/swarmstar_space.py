import uuid
from typing import List, Tuple

from pydantic import Field

from data.database import Database
from data.enums import DatabaseTableEnum
from data.models.swarmstar_event_model import SwarmstarEventModel
from swarmstar.constants.misc_constants import DEFAULT_SWARMSTAR_ID
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.enums.swarm_status_enum import SwarmStatusEnum
from swarmstar.objects.base_object import BaseObject
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.objects.operations.spawn_operation import SpawnOperation
from swarmstar.objects.trees.action_metadata_tree import ActionMetadataTree
from swarmstar.objects.trees.memory_metadata_tree import MemoryMetadataTree
from swarmstar.objects.trees.tool_metadata_tree import ToolMetadataTree
from swarmstar.shapes.contexts.parallel_plan_context import ParallelPlanContext

db = Database()


class SwarmstarSpace(BaseObject):
    """
    A comprehensive collection of all objects that constitute a swarm.
    This includes nodes, metadata, operations, and other related entities
    """

    table_enum = DatabaseTableEnum.SWARMSTAR_SPACE

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))

    goal: str
    swarm_title: str
    memory_title: str
    status: SwarmStatusEnum = SwarmStatusEnum.ACTIVE

    total_event_count: int = 0
    action_node_count: int = 0
    action_metadata_node_count: int = 0
    memory_metadata_node_count: int = 0
    tool_metadata_node_count: int = 0
    spawn_operation_count: int = 0
    termination_operation_count: int = 0
    blocking_operation_count: int = 0
    communication_operation_count: int = 0
    function_call_operation_count: int = 0

    queued_operation_ids: List[str] = []


    @staticmethod
    async def instantiate(
        goal: str, swarm_title: str, memory_title: str
    ) -> Tuple["SwarmstarSpace", "SpawnOperation"]:
        """
        Args:
            goal (str): The goal of the swarm
            swarm_title (str): The title of the swarm
            memory_title (str): The title of the memory

        Returns:
            SwarmstarSpace: The swarmstar space object

        Call this function to create a new swarmstar space. This function will make a copy
        of the default swarmstar space (action/memory/tool metadata trees) and returns an 
        initial spawn operation that will the root of the swarm's action tree.
        """
        default_swarmstar_space = await SwarmstarSpace.read(DEFAULT_SWARMSTAR_ID)

        swarm = SwarmstarSpace(
            id=str(uuid.uuid4()),
            goal=goal,
            swarm_title=swarm_title,
            memory_title=memory_title,
            status=SwarmStatusEnum.ACTIVE,
            action_metadata_node_count=default_swarmstar_space.action_metadata_node_count,
            memory_metadata_node_count=default_swarmstar_space.memory_metadata_node_count,
            tool_metadata_node_count=default_swarmstar_space.tool_metadata_node_count,
        )

        spawn_root_action_operation = SpawnOperation(
            action_enum=ActionEnum.PARALLEL_PLAN,
            swarm_id=swarm.id,
            goal=goal,
            context=ParallelPlanContext()
        )

        return swarm, spawn_root_action_operation

    @staticmethod
    async def execute_operation(operation_id: str) -> List[str]:
        """
        Execute an operation and return the new operation ids.
        """
        return await BaseOperation.execute(operation_id)

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
        history_entries = (
            session.query(SwarmstarEventModel)
            .filter_by(swarmstar_space_id=swarm_id)
            .order_by(SwarmstarEventModel.event_count)
            .all()
        )

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
        history_entry = (
            session.query(SwarmstarEventModel)
            .filter_by(swarmstar_space_id=swarm_id)
            .order_by(SwarmstarEventModel.event_count.desc())
            .first()
        )

        if history_entry:
            for key, value in history_entry.data.items():
                setattr(SwarmstarSpace, key, value)
        session.commit()
