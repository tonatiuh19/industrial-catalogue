import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, Users, CheckCircle, XCircle } from "lucide-react";

interface NotificationSettings {
  enable_client_notifications?: string;
  enable_admin_notifications?: string;
}

interface AdminNotification {
  id: number;
  admin_id: number;
  notification_type: string;
  is_enabled: boolean;
  email: string;
  first_name: string;
  last_name: string;
}

export default function Settings() {
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [settings, setSettings] = useState<NotificationSettings>({});
  const [adminNotifications, setAdminNotifications] = useState<
    AdminNotification[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

    fetchSettings();
    fetchAdminNotifications();
  }, [admin]);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/notification-settings");
      const result = await response.json();
      if (result.success) {
        setSettings(result.data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Error al cargar la configuración",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications");
      const result = await response.json();
      if (result.success) {
        setAdminNotifications(result.data);
      }
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/notification-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Configuración Guardada",
          description: "La configuración se ha guardado exitosamente",
        });
      } else {
        throw new Error(result.error || "Error al guardar");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error",
        description: "Error al guardar la configuración",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateAdminNotification = async (
    adminId: number,
    notificationType: string,
    isEnabled: boolean,
  ) => {
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          admin_id: adminId,
          notification_type: notificationType,
          is_enabled: isEnabled,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setAdminNotifications((prev) =>
          prev.map((notif) =>
            notif.admin_id === adminId &&
            notif.notification_type === notificationType
              ? { ...notif, is_enabled: isEnabled }
              : notif,
          ),
        );
        toast({
          title: "Configuración Actualizada",
          description: "Configuración de notificaciones actualizada",
        });
      }
    } catch (error) {
      console.error("Error updating admin notification:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la configuración",
        variant: "destructive",
      });
    }
  };

  const handleSettingChange = (
    key: keyof NotificationSettings,
    value: string,
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
          Administradores pueden acceder a la configuración.
        </p>
        <Button onClick={() => navigate("/admin/dashboard")}>
          Volver al Tablero
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configuración del Sistema
        </h1>
        <p className="text-slate-600">
          Gestiona la configuración de notificaciones
        </p>
      </div>

      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Global de Notificaciones</CardTitle>
              <CardDescription>
                Habilita o deshabilita tipos de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="client-notifications">
                    Notificaciones a Clientes
                  </Label>
                  <p className="text-sm text-slate-600">
                    Enviar emails de confirmación a clientes que soliciten
                    cotizaciones
                  </p>
                </div>
                <Switch
                  id="client-notifications"
                  checked={settings.enable_client_notifications === "1"}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "enable_client_notifications",
                      checked ? "1" : "0",
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="admin-notifications">
                    Notificaciones a Administradores
                  </Label>
                  <p className="text-sm text-slate-600">
                    Enviar notificaciones a administradores sobre nuevas
                    cotizaciones
                  </p>
                </div>
                <Switch
                  id="admin-notifications"
                  checked={settings.enable_admin_notifications === "1"}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "enable_admin_notifications",
                      checked ? "1" : "0",
                    )
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Administradores - Notificaciones de Cotizaciones
              </CardTitle>
              <CardDescription>
                Configura qué administradores reciben notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminNotifications
                  .filter(
                    (notif) => notif.notification_type === "quote_requests",
                  )
                  .map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">
                          {notif.first_name} {notif.last_name}
                        </div>
                        <div className="text-sm text-slate-600">
                          {notif.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {notif.is_enabled ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-slate-400" />
                        )}
                        <Switch
                          checked={notif.is_enabled}
                          onCheckedChange={(checked) =>
                            updateAdminNotification(
                              notif.admin_id,
                              notif.notification_type,
                              checked,
                            )
                          }
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
