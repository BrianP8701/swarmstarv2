from math import log
from typing import Dict, List, Type, TypeVar, cast
import os
from dotenv import load_dotenv

import instructor 
from pydantic import BaseModel
from openai import AsyncOpenAI
from swarmstar.enums.message_role_enum import MessageRole
from swarmstar.objects.base_message import BaseMessage
from swarmstar.objects.nodes.swarm_node import SwarmNode
from swarmstar.objects.operations.base_operation import BaseOperation

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
        operation: BaseOperation,
        max_retries: int = 3,
    ) -> T:
        log_index_key = operation.context.get("log_index_key", [])
        request_log_messages = [BaseMessage(role=MessageRole(m["role"]), **m) for m in messages]
        log_index_key = await operation.swarm_node.log_multiple(request_log_messages, log_index_key)

        completion: T = await cls.aclient.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0.0,
            seed=69,
            max_retries=max_retries,
            response_model=instructor_model
        ) # type: ignore

        response_message = BaseMessage(
            role=MessageRole.ASSISTANT,
            content=completion.model_dump_json()
        )
        log_index_key = await operation.swarm_node.log(response_message, log_index_key)
        operation.context["log_index_key"] = log_index_key
        await operation.update(operation.id, {"context": operation.context})

        return completion
