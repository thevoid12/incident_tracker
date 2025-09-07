import pytest
from . import Permission, get_role_permissions, permissions_to_bytes, has_permission, bytes_to_permissions

class TestRBAC:
    def test_get_role_permissions_admin(self):
        """Test admin role returns all permissions (0)"""
        result = get_role_permissions("Admin")
        assert result == b'\x00'

    def test_get_role_permissions_user(self):
        """Test user role returns correct permission mask"""
        result = get_role_permissions("User")
        expected_mask = 0
        for perm in [Permission.PermCreateIncident, Permission.PermViewIncident,
                     Permission.PermUpdateIncident, Permission.PermViewAuditTrail]:
            expected_mask |= (1 << perm.value)
        expected_bytes = permissions_to_bytes(expected_mask)
        assert result == expected_bytes

    def test_has_permission_admin_all_true(self):
        """Test admin has all permissions"""
        admin_perms = b'\x00'
        assert has_permission(admin_perms, Permission.PermCreateIncident) == True
        assert has_permission(admin_perms, Permission.PermViewIncident) == True
        assert has_permission(admin_perms, Permission.PermUpdateIncident) == True
        assert has_permission(admin_perms, Permission.PermViewAuditTrail) == True

    def test_has_permission_user_correct_perms(self):
        """Test user has correct permissions"""
        user_perms = get_role_permissions("User")
        assert has_permission(user_perms, Permission.PermCreateIncident) == True
        assert has_permission(user_perms, Permission.PermViewIncident) == True
        assert has_permission(user_perms, Permission.PermUpdateIncident) == True
        assert has_permission(user_perms, Permission.PermViewAuditTrail) == True

    def test_has_permission_user_incorrect_perms(self):
        """Test user does not have incorrect permissions"""
        user_perms = get_role_permissions("User")
        assert has_permission(user_perms, Permission.PermDeleteIncident) == False
        assert has_permission(user_perms, Permission.PermCreateAuditTrail) == False

    def test_bytes_permissions_round_trip(self):
        """Test bytes to permissions conversion round trip"""
        original = 150  # Example mask
        bytes_data = permissions_to_bytes(original)
        converted_back = bytes_to_permissions(bytes_data)
        assert converted_back == original

    def test_permissions_to_bytes_zero(self):
        """Test permissions to bytes for zero (all permissions)"""
        result = permissions_to_bytes(0)
        assert result == b'\x00'

    def test_permissions_to_bytes_non_zero(self):
        """Test permissions to bytes for non-zero value"""
        mask = 150  # 0b10010110
        result = permissions_to_bytes(mask)
        # 150 in bytes: since 150 < 256, should be b'\x96'
        assert result == b'\x96'

    def test_invalid_role(self):
        """Test invalid role returns empty permissions"""
        result = get_role_permissions("InvalidRole")
        assert result == b'\x00'  # No permissions