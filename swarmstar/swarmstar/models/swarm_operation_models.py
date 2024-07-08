from sqlalchemy import Column, ForeignKey, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON

from swarmstar.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class BaseOperationModel(BaseSQLAlchemyModel):
    __tablename__ = 'operations'
    id = Column(String, primary_key=True)
    type = Column(String)
    swarm_node_id = Column(String, ForeignKey('swarm_nodes.id'))
    context = Column(SQLiteJSON)
    __mapper_args__ = {
        'polymorphic_identity': 'operation',
        'polymorphic_on': type
    }

class SpawnOperationModel(BaseOperationModel):
    __tablename__ = 'spawn_operations'
    id = Column(String, ForeignKey('operations.id'), primary_key=True)
    goal = Column(SQLiteJSON)
    parent_swarm_node_id = Column(String)
    __mapper_args__ = {
        'polymorphic_identity': 'spawn_operation',
    }

class ActionOperationModel(BaseOperationModel):
    __tablename__ = 'action_operations'
    id = Column(String, ForeignKey('operations.id'), primary_key=True)
    function_to_call = Column(String)
    args = Column(SQLiteJSON)
    __mapper_args__ = {
        'polymorphic_identity': 'action_operation',
    }

class TerminationOperationModel(BaseOperationModel):
    __tablename__ = 'termination_operations'
    id = Column(String, ForeignKey('operations.id'), primary_key=True)
    terminator_id = Column(String)
    __mapper_args__ = {
        'polymorphic_identity': 'termination_operation',
    }

class CommunicationOperationModel(BaseOperationModel):
    __tablename__ = 'communication_operations'
    id = Column(String, ForeignKey('operations.id'), primary_key=True)
    message = Column(String)
    next_function_to_call = Column(String)
    __mapper_args__ = {
        'polymorphic_identity': 'communication_operation',
    }
