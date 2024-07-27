from typing import List, Optional
from swarmstar.objects.operations.base_operation import BaseOperation
from swarmstar.shapes.contexts.base_context import BaseContext

class BaseRouteMetadataTreeContext(BaseContext):
    content: str
    start_node_id: Optional[str]
    current_node_id: Optional[str]
    marked_node_ids: List[str] = []
