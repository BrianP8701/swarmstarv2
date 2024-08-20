from abc import ABC, abstractmethod
from typing import Any, Dict, List


class AbstractStorage(ABC):
    @abstractmethod
    def upload_file(self, file_path: str, destination: str) -> None:
        """
        Uploads a file to the storage system.

        :param file_path: The local path of the file to upload.
        :param destination: The destination path in the storage system.
        """
        pass

    @abstractmethod
    def download_file(self, source: str, destination: str) -> None:
        """
        Downloads a file from the storage system.

        :param source: The source path in the storage system.
        :param destination: The local path to save the downloaded file.
        """
        pass

    @abstractmethod
    def delete_file(self, file_path: str) -> None:
        """
        Deletes a file from the storage system.

        :param file_path: The path of the file to delete in the storage system.
        """
        pass

    @abstractmethod
    def list_files(self, directory: str) -> List[str]:
        """
        Lists all files in a directory in the storage system.

        :param directory: The directory path in the storage system.
        :return: A list of file paths.
        """
        pass

    @abstractmethod
    def get_file_metadata(self, file_path: str) -> Dict[str, Any]:
        """
        Retrieves metadata for a file in the storage system.

        :param file_path: The path of the file in the storage system.
        :return: A dictionary containing the file metadata.
        """
        pass

    @abstractmethod
    def copy_file(self, source: str, destination: str) -> None:
        """
        Copies a file within the storage system.

        :param source: The source path of the file in the storage system.
        :param destination: The destination path in the storage system.
        """
        pass

    @abstractmethod
    def move_file(self, source: str, destination: str) -> None:
        """
        Moves a file within the storage system.

        :param source: The source path of the file in the storage system.
        :param destination: The destination path in the storage system.
        """
        pass
