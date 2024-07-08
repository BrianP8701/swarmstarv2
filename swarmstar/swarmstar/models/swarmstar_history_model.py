from sqlalchemy import Column, String, Integer, JSON, Enum as SQLAlchemyEnum
from contextlib import contextmanager

from swarmstar.enums.database_table import DatabaseTable
from swarmstar.models.base_sqlalchemy_model import BaseSQLAlchemyModel

class SwarmstarHistoryModel(BaseSQLAlchemyModel):
    __tablename__ = 'swarmstar_history'
    id = Column(Integer, primary_key=True, autoincrement=True)
    swarmstar_space_id = Column(String)
    operation = Column(String)  # e.g., 'update', 'delete', etc.
    data = Column(JSON)  # Store the state of the model after the operation
    model_name = Column(SQLAlchemyEnum(DatabaseTable), nullable=False)  # Name of the model being changed

    @staticmethod
    @contextmanager
    def rollback_to_event(session, model, event_index):
        """
        Temporarily roll back the model to the state at the specified event index.

        :param session: SQLAlchemy session
        :param model: The model instance to roll back
        :param event_index: The event index to roll back to
        """
        # Save the current state
        current_state = model.__dict__.copy()

        try:
            # Rollback to the specified event
            history_entries = session.query(SwarmstarHistoryModel).filter_by(
                model_name=model.__name__,
                swarmstar_space_id=model.swarmstar_space_id
            ).order_by(SwarmstarHistoryModel.event_count).all()

            for entry in history_entries:
                if entry.event_count > event_index:
                    break
                for key, value in entry.data.items():
                    setattr(model, key, value)
            session.commit()
            yield
        finally:
            # Restore the most recent state
            for key, value in current_state.items():
                setattr(model, key, value)
            session.commit()

    @staticmethod
    def advance_to_present(session, model):
        """
        Restore the model to its most recent state.

        :param session: SQLAlchemy session
        :param model: The model instance to restore
        """
        # Get the most recent state from the history
        history_entry = session.query(SwarmstarHistoryModel).filter_by(
            model_name=model.__name__,
            swarmstar_space_id=model.swarmstar_space_id
        ).order_by(SwarmstarHistoryModel.event_count.desc()).first()

        if history_entry:
            for key, value in history_entry.data.items():
                setattr(model, key, value)
        session.commit()
