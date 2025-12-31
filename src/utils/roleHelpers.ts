import { User } from '@auth/user';
import useUser from '@auth/useUser';

/**
 * Check if user has one of the allowed roles
 * @param allowedRoles - Array of allowed role names (case-insensitive comparison)
 * @param userRole - User's role (can be string, array, or null)
 * @returns boolean indicating if user has permission
 */
export function hasRole(allowedRoles: string[], userRole: User['role']): boolean {
	if (!userRole || allowedRoles.length === 0) {
		return false;
	}

	// Normalize role to array for comparison
	const userRoles = Array.isArray(userRole) ? userRole : [userRole];
	
	// Normalize roles to lowercase for case-insensitive comparison
	const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());
	const normalizedUserRoles = userRoles.map((r) => String(r).toLowerCase());

	// Check if any of the user's roles match the allowed roles
	return normalizedUserRoles.some((role) => normalizedAllowedRoles.includes(role));
}

/**
 * Hook to check if current user has supplier or superadmin role
 * Supports both 'supplier'/'superadmin' and 'Supplier'/'SuperAdmin' formats
 * @returns boolean indicating if user can perform supplier/superadmin actions
 */
export function useCanDeleteProduct(): boolean {
	const { data: user } = useUser();
	
	if (!user?.role) {
		return false;
	}

	// Check for both lowercase and camelCase variations
	return hasRole(['supplier', 'superadmin', 'superAdmin'], user.role);
}

