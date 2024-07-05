from sqlalchemy import Column, String, Text, JSON
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class BlockingOperationModel(Base):
    __tablename__ = 'blocking_operations'
    id = Column(String, primary_key=True)
    node_id = Column(String)
    blocking_type = Column(String)
    args = Column(JSON)
    context = Column(JSON)
    next_function_to_call = Column(String)

class SpawnOperationModel(Base):
    __tablename__ = 'spawn_operations'
    id = Column(String, primary_key=True)
    action_id = Column(String)
    message = Column(JSON)
    context = Column(JSON)
    parent_id = Column(String)
    node_id = Column(String)

class ActionOperationModel(Base):
    __tablename__ = 'action_operations'
    id = Column(String, primary_key=True)
    function_to_call = Column(String)
    node_id = Column(String)
    args = Column(JSON)

class TerminationOperationModel(Base):
    __tablename__ = 'termination_operations'
    id = Column(String, primary_key=True)
    terminator_id = Column(String)
    node_id = Column(String)
    context = Column(JSON)

class UserCommunicationOperationModel(Base):
    __tablename__ = 'user_communication_operations'
    id = Column(String, primary_key=True)
    node_id = Column(String)
    message = Column(Text)
    context = Column(JSON)
    next_function_to_call = Column(String)
