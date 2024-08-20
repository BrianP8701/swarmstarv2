from typing import Optional

from pydantic import BaseModel, Field


class BaseContext(BaseModel):
    """
    Context is how nodes pass information between each other and maintain context across operations internally.
    Represent arguments with required fields.

    Context objects can only contain primitive types, lists, and dictionaries.
    Complex objects, such as database models or full node instances, should be represented by their IDs or simpler representations.
    """

    termination_handler_function_name: Optional[str] = Field(default=None)
    ...
