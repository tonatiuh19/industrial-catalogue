import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, FileText, Users, TrendingUp, Loader2 } from "lucide-react";
import { useAdminStore } from "@/store/AdminStoreContext";
import { categoriesApi } from "@/services/api.service";

export default function AdminHome() {
  const { state, fetchAdminProducts, fetchAdminQuotes, fetchAdminUsers } =
    useAdminStore();
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch data with individual error handling
      await fetchAdminProducts(1, 1).catch((err) =>
        console.error("Products error:", err),
      );
      await fetchAdminQuotes(1, 1).catch((err) =>
        console.error("Quotes error:", err),
      );
      await fetchAdminUsers().catch((err) =>
        console.error("Users error:", err),
      );

      // Load categories
      try {
        const response = await categoriesApi.getAll();
        const categories = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
            ? response.data
            : [];
        setCategoriesCount(categories.length);
      } catch (err) {
        console.error("Categories error:", err);
      }
    } catch (error) {
      console.error("Dashboard load error:", error);
    } finally {
      setLoading(false);
    }
  };

  const productsTotal = state.products.pagination?.total || 0;
  const quotesTotal = state.quotes.pagination?.total || 0;
  const usersCount = state.users.users?.length || 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tablero</h1>
        <p className="text-slate-600">
          Vista general de tu catálogo industrial
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-accent/5 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">
              Solicitudes de Cotización
            </CardTitle>
            <div className="bg-accent rounded-lg p-2">
              <FileText className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{quotesTotal}</div>
            <p className="text-xs text-slate-600">Cotizaciones pendientes</p>
            <a
              href="/admin/quotes"
              className="mt-3 inline-block text-xs font-semibold text-accent hover:underline"
            >
              Ver Cotizaciones →
            </a>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Usuarios Administradores
            </CardTitle>
            <div className="bg-gradient-to-br from-primary to-accent rounded-lg p-2">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{usersCount}</div>
            <p className="text-xs text-slate-600">Administradores activos</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-accent/10 to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-accent">
              Categorías
            </CardTitle>
            <div className="bg-gradient-to-br from-accent to-primary rounded-lg p-2">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              {categoriesCount}
            </div>
            <p className="text-xs text-slate-600">Categorías de productos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas administrativas comunes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <a
              href="/admin/products"
              className="block p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all border border-primary/20 hover:border-primary/30 hover:shadow-md"
            >
              <div className="font-medium text-primary">
                Agregar Nuevo Producto
              </div>
              <div className="text-sm text-slate-600">
                Crear un nuevo producto en el catálogo
              </div>
            </a>
            <a
              href="/admin/quotes"
              className="block p-4 rounded-lg bg-gradient-to-br from-accent/5 to-accent/10 hover:from-accent/10 hover:to-accent/20 transition-all border border-accent/20 hover:border-accent/30 hover:shadow-md"
            >
              <div className="font-medium text-accent">Ver Cotizaciones</div>
              <div className="text-sm text-slate-600">
                Revisar solicitudes de cotización de clientes
              </div>
            </a>
            <a
              href="/admin/content"
              className="block p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/15 hover:to-accent/15 transition-all border border-primary/20 hover:border-accent/30 hover:shadow-md"
            >
              <div className="font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Editar Páginas de Contenido
              </div>
              <div className="text-sm text-slate-600">
                Actualizar términos y condiciones, política de privacidad
              </div>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actualizaciones y cambios</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-slate-600 text-center py-8">
              Sin actividad reciente
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
