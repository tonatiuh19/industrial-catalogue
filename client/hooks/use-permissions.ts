import { useAdmin } from "@/context/AdminContext";

type Role = "admin" | "super_admin";

export function usePermissions() {
  const { admin } = useAdmin();

  const hasRole = (roles: Role | Role[]): boolean => {
    if (!admin) return false;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(admin.role);
  };

  const isSuperAdmin = (): boolean => {
    return admin?.role === "super_admin";
  };

  const isAdmin = (): boolean => {
    return admin?.role === "admin";
  };

  const canManageUsers = (): boolean => {
    return isSuperAdmin();
  };

  const canManageContent = (): boolean => {
    return isSuperAdmin();
  };

  const canManageSettings = (): boolean => {
    return isSuperAdmin();
  };

  const canManageProducts = (): boolean => {
    return hasRole(["admin", "super_admin"]);
  };

  const canManageQuotes = (): boolean => {
    return hasRole(["admin", "super_admin"]);
  };

  return {
    hasRole,
    isSuperAdmin,
    isAdmin,
    canManageUsers,
    canManageContent,
    canManageSettings,
    canManageProducts,
    canManageQuotes,
  };
}
