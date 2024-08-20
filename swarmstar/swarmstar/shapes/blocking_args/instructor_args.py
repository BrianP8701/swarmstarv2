from typing import List

from swarmstar.enums.instructor_enum import InstructorEnum
from swarmstar.objects.message import Message
from swarmstar.shapes.blocking_args.base_blocking_args import BaseBlockingArgs


class InstructorArgs(BaseBlockingArgs):
    instructor_enum: InstructorEnum
    messages: List[Message]
