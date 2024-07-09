from enum import Enum




memory_type_to_tools = {
    "repository": [
        "find_file", 
        "find_class", 
        "find_function", 
        "find_variable",
        "find_string"
    ],
    # But its not this simple...
    # Depending on the state, we might want to clone to read it
    # Or clone to be able to write to it and make changes
    "github_link": [
        "clone",
        "pull",
        ""
    ]
}

