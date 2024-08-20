from typing import List

from data.enums import DatabaseTableEnum
from swarmstar.objects.base_object import BaseObject


class User(BaseObject['User']):
    table_enum = DatabaseTableEnum.USERS

    id: str
    stripe_id: str
    swarm_ids: List[str]
