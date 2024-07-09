from enum import Enum

class MemoryTypeEnum(Enum, str):
    FOLDER = 'folder'
    GITHUB_REPOSITORY_LINK = 'github_repository_link'
    PYTHON_FILE = 'python_file'
    TYPESCRIPT_FILE = 'typescript_file'
    STRING = 'string'
    