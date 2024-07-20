"""
Routers are used to navigate a metadata tree to find a node.

This is a base class to easily create routers over any MetadataTree.
"""
from typing import List, Optional
from abc import ABC
from pydantic import BaseModel

from swarmstar.instructor.instructor import Instructor
from swarmstar.instructor.instructors.router_instructor import RouterInstructor
from swarmstar.objects.nodes.base_metadata_node import BaseMetadataNode
from swarmstar.objects.operations.base_operation import BaseOperation

instructor = Instructor()

class RouteDecision(BaseModel):
    chosen_node: Optional[BaseMetadataNode] = None
    unviable_nodes: List[BaseMetadataNode] = []

class BaseRouter(ABC):
    __system_instructions__: str

    async def main(
        self, 
        node: BaseMetadataNode, 
        content: str, 
        operation: Optional[BaseOperation] = None
    ) -> RouteDecision:
        children = await node.get_children()
        router_decision = await instructor.instruct(
            messages=RouterInstructor.generate_instructions(
                children,
                content,
                self.__system_instructions__
            ),
            instructor_model=RouterInstructor,
            operation=operation
        )
        return RouteDecision(
            chosen_node=children[router_decision.best_option] if router_decision.best_option is not 0 else None,
            unviable_nodes=[children[i-1] for i in router_decision.unviable_options]
        )
