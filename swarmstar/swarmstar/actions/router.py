from typing import ClassVar, Generic, List, Protocol, TypeVar
from pydantic import BaseModel

from swarmstar.instructor.instructor import Instructor
from swarmstar.instructor.instructors.router_instructor import RouterInstructorModel
from swarmstar.objects.operations.base_operation import BaseOperation

T = TypeVar('T', bound='OptionLike')

class OptionLike(Protocol):
    id: str
    title: str
    description: str

class RouterResponse(BaseModel, Generic[T]):
    best_option: T | None
    unviable_options: List[T]


class Router(BaseModel, Generic[T]):
    __system_prompt__: ClassVar[str] = """
    You are responsible for naviagting a tree by descriptions. 
    You will be given a list of options and a prompt. 
    You will need to select the best option from the list that is most relevant to the prompt.
    You will also need to mark options as unviable if they are not relevant to the prompt.
    """

    @classmethod
    async def route(cls, options: List[T], prompt: str, operation: BaseOperation) -> RouterResponse[T]:
        formatted_options = cls._format_options(options, prompt)
        router_response = await Instructor.completion(
            messages=[
                {
                    "role": "system",
                    "content": cls.__system_prompt__
                },
                {
                    "role": "user",
                    "content": formatted_options
                }
            ],
            instructor_model=RouterInstructorModel,
            operation=operation
        )
        best_option_index = router_response.best_option - 1
        best_option = options[best_option_index] if best_option_index >= 0 else None
        unviable_options = [options[i - 1] for i in router_response.unviable_options]
        return RouterResponse(
            best_option=best_option,
            unviable_options=unviable_options
        )

    @staticmethod
    def _format_options(options: List[T], prompt: str) -> str:
       return "Prompt: {}\nOptions:\n{}".format(
            prompt,
            '\n'.join(["{}. {}: {}".format(i + 1, option.title, option.description) for i, option in enumerate(options)])
        )
