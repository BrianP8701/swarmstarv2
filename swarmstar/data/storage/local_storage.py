import os
import shutil
from threading import Lock
from typing import Any, Dict, List

from dotenv import load_dotenv

from data.database.abstract_storage import AbstractStorage

load_dotenv()
STORAGE_FOLDER_PATH = os.getenv("STORAGE_FOLDER_PATH")

if STORAGE_FOLDER_PATH is None:
    raise ValueError("STORAGE_FOLDER_PATH is not set in the .env file")


class LocalStorage(AbstractStorage):
    _instance = None
    _lock = Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super(LocalStorage, cls).__new__(cls)
                    cls._instance._initialize_storage()
        return cls._instance

    def _initialize_storage(self):
        if STORAGE_FOLDER_PATH is None:
            raise ValueError("STORAGE_FOLDER_PATH is not set in the .env file")
        if not os.path.exists(STORAGE_FOLDER_PATH):
            os.makedirs(STORAGE_FOLDER_PATH)

    def _get_full_path(self, path: str) -> str:
        if STORAGE_FOLDER_PATH is None:
            raise ValueError("STORAGE_FOLDER_PATH is not set in the .env file")
        return os.path.join(STORAGE_FOLDER_PATH, path)

    def upload_file(self, file_path: str, destination: str) -> None:
        full_destination = self._get_full_path(destination)
        shutil.copy(file_path, full_destination)

    def download_file(self, source: str, destination: str) -> None:
        full_source = self._get_full_path(source)
        shutil.copy(full_source, destination)

    def delete_file(self, file_path: str) -> None:
        full_path = self._get_full_path(file_path)
        if os.path.exists(full_path):
            os.remove(full_path)
        else:
            raise FileNotFoundError(f"File {file_path} not found in storage")

    def list_files(self, directory: str) -> List[str]:
        full_directory = self._get_full_path(directory)
        if os.path.exists(full_directory):
            return [
                os.path.join(directory, f)
                for f in os.listdir(full_directory)
                if os.path.isfile(os.path.join(full_directory, f))
            ]
        else:
            raise FileNotFoundError(f"Directory {directory} not found in storage")

    def get_file_metadata(self, file_path: str) -> Dict[str, Any]:
        full_path = self._get_full_path(file_path)
        if os.path.exists(full_path):
            return {
                "size": os.path.getsize(full_path),
                "modified_time": os.path.getmtime(full_path),
                "created_time": os.path.getctime(full_path),
            }
        else:
            raise FileNotFoundError(f"File {file_path} not found in storage")

    def copy_file(self, source: str, destination: str) -> None:
        full_source = self._get_full_path(source)
        full_destination = self._get_full_path(destination)
        shutil.copy(full_source, full_destination)

    def move_file(self, source: str, destination: str) -> None:
        full_source = self._get_full_path(source)
        full_destination = self._get_full_path(destination)
        shutil.move(full_source, full_destination)
