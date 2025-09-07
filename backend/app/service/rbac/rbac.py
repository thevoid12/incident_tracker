from .master_permission import Permission,role_permissions

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
