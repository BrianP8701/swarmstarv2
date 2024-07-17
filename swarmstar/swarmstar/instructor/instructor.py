from typing import List, Type, TypeVar, cast
import os
from dotenv import load_dotenv

import instructor 
from openai import AsyncOpenAI
from swarmstar.enums.message_role_enum import MessageRoleEnum
from swarmstar.instructor.instructors.base_instructor import BaseInstructor
from swarmstar.objects.message import Message
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.operations.base_operation import BaseOperation

load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_KEY")

T = TypeVar('T', bound=BaseInstructor)

class Instructor:
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
        operation: BaseOperation,
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

        if logging:
            await cls._log_instructor_call(messages + [response_message], operation)

        return completion

    @staticmethod
    async def _log_instructor_call(messages: List[Message], operation: BaseOperation) -> None:
        swarm_node = await SwarmNode.read(operation.swarm_node_id)
        log_index_key = operation.context.get("log_index_key", [])
        log_index_key = await swarm_node.log_multiple(messages, log_index_key)
        operation.context["log_index_key"] = log_index_key
        await operation.upsert()
