from typing import Any, Dict, Optional
from sqlalchemy import Column, String, Boolean, Enum as SQLAlchemyEnum, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON

from swarmstar.swarmstar.enums.actions import ActionEnum
from swarmstar.swarmstar.enums.termination_policy import TerminationPolicyEnum
from swarmstar.swarmstar.database.sqlite_db import SqliteDatabase

Base = declarative_base()

class SwarmNodeModel(Base):
    __tablename__ = 'swarm_nodes'

    id = Column(String, primary_key=True)
    action = Column(SQLAlchemyEnum(ActionEnum), nullable=False)
    goal = Column(Text, nullable=False)
    alive = Column(Boolean, default=True)
    termination_policy = Column(SQLAlchemyEnum(TerminationPolicyEnum), default=TerminationPolicyEnum.SIMPLE)
    logs = Column(SQLiteJSON, default=list)
    report = Column(Text, nullable=True)
    execution_memory = Column(SQLiteJSON, default=dict)
    context = Column(SQLiteJSON, default=dict)
