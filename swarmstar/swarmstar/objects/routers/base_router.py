from typing import ClassVar, Generic, List, Protocol, TypeVar
from pydantic import BaseModel, Field

from swarmstar.instructor.instructor import Instructor
from swarmstar.instructor.instructor_models.router_instructor_model import RouterInstructorModel

T = TypeVar('T', bound='OptionLike')

class OptionLike(Protocol):
    id: str
    title: str
    description: str

class RouterResponse(BaseModel, Generic[T]):
    best_option: T | None
    unviable_options: List[T]

class BaseRouter(BaseModel, Generic[T]):
    __system_prompt__: ClassVar[str]

    @classmethod
    async def route(cls, options: List[T]) -> RouterResponse[T]:
        router_response = await Instructor.completion(
            messages=[
                {
                    "role": "system",
                    "content": cls.__system_prompt__
                }
            ],
            instructor_model=RouterInstructorModel
        )
        best_option_index = router_response.best_option - 1
        best_option = options[best_option_index] if best_option_index >= 0 else None
        unviable_options = [options[i - 1] for i in router_response.unviable_options]
        return RouterResponse(
            best_option=best_option,
            unviable_options=unviable_options
        )

    @staticmethod
    def _format_options(options: List[OptionLike]) -> str:
        return "\n".join([f"{i + 1}. {option.title}: {option.description}" for i, option in enumerate(options)])
