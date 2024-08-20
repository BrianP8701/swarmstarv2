from __future__ import annotations

from typing import List

from data.enums import DatabaseTableEnum
from swarmstar.enums.action_enum import ActionEnum
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.objects.operations.function_call_operation import FunctionCallOperation
from swarmstar.shapes.contexts.base_context import BaseContext


class SpawnOperation(BaseOperation):
    table_enum = DatabaseTableEnum.SPAWN_OPERATIONS

    goal: str
    action_enum: ActionEnum
    context: BaseContext

    async def _execute(self) -> List["FunctionCallOperation"]:
        from swarmstar.constants.action_constants import (
            ACTION_ENUM_TO_ACTION_NODE_CLASS,
        )

        ActionNodeClass = ACTION_ENUM_TO_ACTION_NODE_CLASS[self.action_enum]

        new_action_node = ActionNodeClass(
            swarm_id=self.swarm_id, goal=self.goal, context=self.context
        )

        return [
            FunctionCallOperation(
                swarm_id=self.swarm_id,
                action_node_id=new_action_node.node_id,
                function_to_call="main",
            )
        ]
