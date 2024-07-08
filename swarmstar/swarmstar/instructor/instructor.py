from typing import Dict, List, Type, TypeVar, cast
import os
from dotenv import load_dotenv

import instructor 
from pydantic import BaseModel
from openai import AsyncOpenAI

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY")

T = TypeVar('T', bound=BaseModel)

class Instructor:
    _instance = None
    aclient: AsyncOpenAI

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.aclient = cast(AsyncOpenAI, instructor.patch(AsyncOpenAI(api_key=OPENAI_KEY)))
        return cls._instance

    @classmethod
    async def completion(
        cls,
        messages: List[Dict[str, str]],
        instructor_model: Type[T],
        max_retries: int = 3,
    ) -> T:
        completion: T = await cls.aclient.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.0,
            seed=69,
            max_retries=max_retries,
            response_model=instructor_model
        ) # type: ignore

        return completion
