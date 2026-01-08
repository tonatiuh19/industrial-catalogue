import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function Settings() {
  const { admin } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has permission to access this page
    if (admin?.role !== "super_admin") {
      toast({
        title: "Acceso Denegado",
        description: "No tienes permisos para acceder a esta página",
        variant: "destructive",
      });
      navigate("/admin/dashboard");
    }
  }, [admin]);

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-600">Configure your admin panel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage your application settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-600">
            Settings coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
