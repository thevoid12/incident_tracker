from .master_permission import Permission

def has_permission(user_permissions: bytes, required_permission: Permission) -> bool:
    """
    Check if user has the required permission.
    Returns True if has permission, False otherwise.
    Input: user_permissions (bytes from DB/JWT), required_permission (Permission enum, e.g., Permission.PermUpdateIncident)
    """
    perm_int = bytes_to_permissions(user_permissions)
    if perm_int == 0:  # Has all permissions
        return True
    perm_mask = 1 << required_permission.value
    return bool(perm_int & perm_mask)

def bytes_to_permissions(data: bytes) -> int:
    return int.from_bytes(data, byteorder='big')

