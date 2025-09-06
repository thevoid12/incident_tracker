from enum import Enum

class UserAction(str, Enum):
    """Enum for user action types in audit trail"""
    ############### login #######################
    CREATE_USER = "CREATE_USER"
    UPDATE_USER = "UPDATE_USER"
    DELETE_USER = "DELETE_USER"

    ############### incident #######################
    CREATE_INCIDENT = "CREATE_INCIDENT"
    UPDATE_INCIDENT = "UPDATE_INCIDENT"
    DELETE_INCIDENT = "DELETE_INCIDENT"



