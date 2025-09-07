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
    # add as many permisions, but causion dont change the existing permision

# Role to permissions mapping - list of permissions in any order
role_permissions = {
    "Admin": [Permission.PermAll],
    "User": [Permission.PermCreateIncident, Permission.PermViewIncident, Permission.PermUpdateIncident,Permission.PermViewAuditTrail],
    # Add as much user roles as needed
}

# List of available roles
roles = list(role_permissions.keys())

def get_role_permissions(role: str) -> bytes:
    """
    Get the permission mask for a role as byte array.
    Returns b'\x00' for all permissions if PermAll is in the list.
    """
    perms = role_permissions.get(role, [])
    if Permission.PermAll in perms:
        return b'\x00'  # All permissions
    mask = 0
    for perm in perms:
        mask |= (1 << perm.value)
    return permissions_to_bytes(mask)

def permissions_to_bytes(perm: int) -> bytes:
    if perm == 0:
        return b'\x00'
    return perm.to_bytes((perm.bit_length() + 7) // 8, byteorder='big')