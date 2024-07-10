def enum_to_string(enum_value):
    """
    Converts an enum value to a string with all lowercase, spaces instead of underscores, and capitalized first letter of each word.
    
    :param enum_value: The enum value to convert.
    :return: The converted string.
    """
    return enum_value.value.lower().replace('_', ' ').title()
