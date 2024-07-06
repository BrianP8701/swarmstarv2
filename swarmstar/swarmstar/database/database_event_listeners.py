from sqlalchemy import event
from sqlalchemy.orm import Session

from swarmstar.swarmstar.models.swarm_node import SwarmNodeModel
from swarmstar.swarmstar.models.swarm_operations import (
    BlockingOperationModel, 
    SpawnOperationModel, 
    ActionOperationModel,
    TerminationOperationModel, 
    UserCommunicationOperationModel
)
from swarmstar.swarmstar.models.swarmstar_space import SwarmstarSpaceModel
from swarmstar.swarmstar.models.swarmstar_event import SwarmstarEventModel
from swarmstar.swarmstar.utils.misc.ids import extract_swarm_id

all_models_excluding_history = [
    SwarmNodeModel, 
    SwarmstarSpaceModel, 
    SpawnOperationModel, 
    TerminationOperationModel, 
    BlockingOperationModel, 
    UserCommunicationOperationModel, 
    ActionOperationModel
]

def log_change(mapper, connection, target):
    session = Session.object_session(target)
    swarmstar_space_id = extract_swarm_id(target.id)
    swarmstar_space = session.query(SwarmstarSpaceModel).filter_by(id=swarmstar_space_id).one()
    swarmstar_space.total_event_count += 1  # Increment event_count in SwarmstarSpaceModel
    history_entry = SwarmstarEventModel(
        event_count=swarmstar_space.total_event_count,
        swarmstar_space_id=swarmstar_space_id,
        operation='update',  # or 'insert', 'delete', etc.
        data=target.__dict__.copy(),
        model_name=target.__class__.__name__
    )
    if session:
        session.add(history_entry)
        session.commit()

for model in all_models_excluding_history:
    event.listen(model, 'after_insert', log_change)
    event.listen(model, 'after_update', log_change)
    event.listen(model, 'after_delete', log_change)
