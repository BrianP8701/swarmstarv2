from typing import Any, Dict, Type
from pydantic import BaseModel

from swarmstar.enums.instructor_enum import InstructorEnum

from swarmstar.instructors.instructors.router_instructor import RouterInstructor
from swarmstar.instructors.instructors.question_instructor import QuestionInstructor

INSTRUCTOR_PROPERTIES: Dict[InstructorEnum, Dict[str, Any]] = {
    InstructorEnum.ROUTER_INSTRUCTOR: {
        "class": RouterInstructor
    },
    InstructorEnum.QUESTION_INSTRUCTOR: {
        "class": QuestionInstructor
    }
}

INSTRUCTOR_ENUM_TO_CLASS: Dict[InstructorEnum, Type[BaseModel]] = {
    InstructorEnum.ROUTER_INSTRUCTOR: RouterInstructor,
    InstructorEnum.QUESTION_INSTRUCTOR: QuestionInstructor
}
