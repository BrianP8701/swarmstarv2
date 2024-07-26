from typing import List, Optional
from swarmstar.shapes.blocking_args.base_blocking_args import BaseBlockingArgs

class SearchArgs(BaseBlockingArgs):
    questions: List[str]
    context: Optional[str] = None
