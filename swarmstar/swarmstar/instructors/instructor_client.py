from typing import List, Optional, Type, TypeVar, cast
import os
from dotenv import load_dotenv

import instructor 
from openai import AsyncOpenAI
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructors.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.nodes.base_action_node import BaseActionNode
from swarmstar.objects.operations.base_operation import BaseOperation

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY")

T = TypeVar('T', bound=BaseInstructor)

class InstructorClient:
    _instance = None
    aclient: AsyncOpenAI

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.aclient = cast(AsyncOpenAI, instructor.patch(AsyncOpenAI(api_key=OPENAI_KEY)))
        return cls._instance

    @classmethod
    async def instruct(
        cls,
        messages: List[Message],
        instructor_model: Type[T],
        action_node_id: Optional[str],
        max_retries: int = 3,
        logging: bool = True,
    ) -> T:
        completion: T = await cls.aclient.chat.completions.create(
            model="gpt-4o",
            messages=[message.convert_to_openai_message() for message in messages],
            temperature=0.0,
            seed=69,
            max_retries=max_retries,
            response_model=instructor_model
        ) # type: ignore

        response_message = Message(
            role=MessageRoleEnum.ASSISTANT,
            content=completion.model_dump_json()
        )

        if logging and action_node_id is not None:
            await cls._log_instructor_call(messages + [response_message], action_node_id)

        return completion

    @staticmethod
    async def _log_instructor_call(messages: List[Message], action_node_id: str) -> None:
        action_node = await BaseActionNode.read(action_node_id) # type: ignore
        await action_node.log_multiple(messages)
        await action_node.upsert()
