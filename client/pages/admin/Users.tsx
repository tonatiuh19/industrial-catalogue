import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/store/AdminStoreContext";
import { useAdmin } from "@/context/AdminContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserWizard from "@/components/UserWizard";
import type { AdminUser } from "@/store/adminState";

export default function Users() {
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const { state, fetchAdminUsers, deleteAdminUser } = useAdminStore();
  const { users: usersState } = state;
  const { toast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Check if user has permission to access this page
    if (admin?.role !== "super_admin") {
      toast({
        title: "Acceso Denegado",
        description: "No tienes permisos para acceder a esta página",
        variant: "destructive",
      });
      navigate("/admin/dashboard");
      return;
    }
    loadUsers();
  }, [admin]);

  const loadUsers = async () => {
    try {
      await fetchAdminUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar los usuarios",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

    try {
      await deleteAdminUser(id);
      toast({
        title: "Éxito",
        description: "Usuario eliminado exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el usuario",
        variant: "destructive",
      });
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setWizardOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setWizardOpen(true);
  };

  const handleWizardClose = () => {
    setWizardOpen(false);
    setSelectedUser(null);
  };

  const handleWizardSuccess = () => {
    loadUsers();
  };

  // Additional safety check
  if (admin?.role !== "super_admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <ShieldAlert className="h-16 w-16 text-slate-400" />
        <h2 className="text-2xl font-semibold text-slate-700">
          Acceso Denegado
        </h2>
        <p className="text-slate-600 text-center max-w-md">
          No tienes permisos para acceder a esta página. Solo los Super
          Administradores pueden gestionar usuarios.
        </p>
        <Button onClick={() => navigate("/admin/dashboard")}>
          Volver al Tablero
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Usuarios Administradores
          </h1>
          <p className="text-slate-600">Administrar cuentas de administrador</p>
        </div>
        <Button onClick={handleAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Usuario
        </Button>
      </div>

      <UserWizard
        open={wizardOpen}
        onClose={handleWizardClose}
        onSuccess={handleWizardSuccess}
        user={selectedUser}
      />

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Administradores</CardTitle>
        </CardHeader>
        <CardContent>
          {usersState.loading.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : usersState.users.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              No se encontraron usuarios
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[180px]">Nombre</TableHead>
                    <TableHead className="min-w-[200px]">
                      Correo Electrónico
                    </TableHead>
                    <TableHead className="min-w-[160px]">Rol</TableHead>
                    <TableHead className="min-w-[100px]">Estado</TableHead>
                    <TableHead className="min-w-[140px]">
                      Último Acceso
                    </TableHead>
                    <TableHead className="text-right min-w-[120px]">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersState.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "super_admin"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.role === "super_admin"
                            ? "Super Administrador"
                            : "Administrador"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.is_active ? "default" : "secondary"}
                        >
                          {user.is_active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.last_login
                          ? new Date(user.last_login).toLocaleDateString()
                          : "Nunca"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
