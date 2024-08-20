from sqlalchemy import Column
from sqlalchemy import Enum as SqlAlchemyEnum
from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

from swarmstar.enums.swarm_status_enum import SwarmStatusEnum

Base = declarative_base()


class SwarmstarSpaceModel(Base):
    __tablename__ = "swarmstar_space"
    id = Column(String, primary_key=True)
    goal = Column(String)
    swarm_title = Column(String)
    memory_title = Column(String)
    status = Column(
        SqlAlchemyEnum(SwarmStatusEnum), default=SwarmStatusEnum.WAITING_FOR_USER_INPUT
    )

    total_event_count = Column(
        Integer, nullable=False
    )  # total number of events in the space, used for rollbacks
    swarm_node_count = Column(Integer)
    action_node_count = Column(Integer)
    action_metadata_node_count = Column(Integer)
    memory_metadata_node_count = Column(Integer)
    tool_metadata_node_count = Column(Integer)
    spawn_operation_count = Column(Integer)
    termination_operation_count = Column(Integer)
    blocking_operation_count = Column(Integer)
    communication_operation_count = Column(Integer)
    function_call_operation_count = Column(Integer)
    queued_operation_ids = Column(SQLiteJSON, default=lambda: [])

    user_id = Column(String, ForeignKey("users.id"))
    user = relationship("UserModel", back_populates="swarms")
