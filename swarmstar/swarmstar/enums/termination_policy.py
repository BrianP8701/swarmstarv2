from enum import Enum

class TerminationPolicyEnum(Enum, str):
    SIMPLE = "simple"
    CONFIRM_DIRECTIVE_COMPLETION = "confirm_directive_completion"
    CUSTOM_TERMINATION_HANDLER = "custom_termination_handler"
