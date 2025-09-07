from enum import Enum

# starts from 0th bit.
class Permission(Enum):
    PermAll = 0
    PermCreateIncident = 1
    PermViewIncident = 2
    PermDeleteIncident = 3
    PermUpdateIncident = 4
    PermViewAllIncident = 5
    PermCreateAuditTrail = 6
    PermViewAuditTrail = 7
    PermViewAllAuditTrail = 8 # view audit trail that is not only the user's but all user's 
    # add as many permisions, but causion dont change the existing permision

# Role to permissions mapping - list of permissions in any order
role_permissions = {
    "Admin": [Permission.PermAll],
    "User": [Permission.PermCreateIncident, Permission.PermViewIncident, Permission.PermUpdateIncident,Permission.PermViewAuditTrail],
    # Add as much user roles as needed
}

# List of available roles
roles = list(role_permissions.keys())
