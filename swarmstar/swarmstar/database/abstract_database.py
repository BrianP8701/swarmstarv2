import os
from dotenv import load_dotenv
from abc import ABC, abstractmethod
from typing import Any, Callable, Dict

load_dotenv()
db_connection_string = os.getenv("DB_CONNECTION_STRING")

class AbstractDatabase(ABC):
    def __init__(self, *args, **kwargs):
        super().__init__()

    @abstractmethod
    def dispose_instance(self) -> None:
        """
        Disposes of the database instance, effectively clearing any existing connections.
        """
        pass

    @abstractmethod
    def create(self, table_name: str, data: Dict[str, Any]) -> None:
        """
        Inserts a new data entry into the specified table.
        
        :param table_name: The table name.
        :param id: The identifier of the data.
        :param data: The dictionary to be serialized and stored, containing the 'id' key.
        """
        pass

    @abstractmethod
    def read(self, table_name: str, id: str) -> Dict[str, Any]:
        """
        Queries the database for a data entry by its identifier.
        
        :param table_name: The table name.
        :param id: The identifier of the data.
        :return: The deserialized dictionary representing the data.
        """
        pass

    @abstractmethod
    def delete(self, table_name: str, id: str) -> None:
        """
        Deletes a data entry from the specified table using its identifier.
        
        :param table_name: The table name.
        :param id: The identifier of the data to delete.
        """
        pass

    @abstractmethod
    def upsert(self, table_name: str, data: Dict[str, Any]) -> None:
        """
        Upserts a data entry into the specified table.
        """
        pass

    @abstractmethod
    def exists(self, table_name: str, id: str) -> bool:
        """
        Checks if a data entry exists in the database using its identifier.
        
        :param table_name: The table name.
        :param id: The identifier of the data.
        :return: True if the data exists, False otherwise.
        """
        pass

    @abstractmethod
    def execute_raw_query(self, query: str) -> Any:
        """
        Executes a raw SQL query against the database.
        
        :param query: The SQL query to execute.
        :return: The result of the query execution.
        """
        pass

    @abstractmethod
    def perform_transaction(self, operations: Callable) -> None:
        """
        Performs a series of operations within a database transaction.
        
        :param operations: A callable that contains the operations to be performed.
        """
        pass

    @abstractmethod
    def clear_table(self, table_name: str, safety: str) -> None:
        """
        Clears all data from a specified table. This operation is irreversible.
        
        :param table_name: The table to be cleared.
        :param safety: A safety string that must match a specific value to confirm the operation.
        """
        pass

