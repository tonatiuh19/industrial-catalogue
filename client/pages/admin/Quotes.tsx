import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/store/AdminStoreContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  contacted: "bg-blue-100 text-blue-800",
  quoted: "bg-purple-100 text-purple-800",
  closed: "bg-gray-100 text-gray-800",
};

export default function Quotes() {
  const { state, fetchAdminQuotes, updateQuoteStatus } = useAdminStore();
  const { quotes: quotesState } = state;
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadQuotes();
  }, [statusFilter]);

  const loadQuotes = async () => {
    try {
      const status = statusFilter === "all" ? undefined : statusFilter;
      await fetchAdminQuotes(1, 20, status);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar las cotizaciones",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (quoteId: number, newStatus: string) => {
    try {
      await updateQuoteStatus(quoteId, newStatus);
      toast({
        title: "Éxito",
        description: "Estado de la cotización actualizado exitosamente",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Error al actualizar el estado de la cotización",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cotizaciones</h1>
          <p className="text-slate-600">
            Ver y administrar solicitudes de cotización de clientes
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los Estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="contacted">Contactado</SelectItem>
            <SelectItem value="quoted">Cotizado</SelectItem>
            <SelectItem value="closed">Cerrado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitudes de Cotización</CardTitle>
        </CardHeader>
        <CardContent>
          {quotesState.loading.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : quotesState.quotes.length === 0 ? (
            <div className="text-center py-12 text-slate-600">
              No se encontraron solicitudes de cotización
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotesState.quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      {new Date(quote.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{quote.customer_name}</p>
                        <p className="text-sm text-slate-600">
                          {quote.customer_email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {quote.product_name || "-"}
                        </p>
                        <p className="text-sm text-slate-600">
                          {quote.product_model || "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{quote.quantity}</TableCell>
                    <TableCell>
                      <Select
                        value={quote.status}
                        onValueChange={(value) =>
                          handleStatusChange(quote.id, value)
                        }
                      >
                        <SelectTrigger className="w-[130px]">
                          <Badge
                            className={
                              statusColors[
                                quote.status as keyof typeof statusColors
                              ]
                            }
                          >
                            {quote.status === "pending"
                              ? "Pendiente"
                              : quote.status === "contacted"
                                ? "Contactado"
                                : quote.status === "quoted"
                                  ? "Cotizado"
                                  : "Cerrado"}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="contacted">Contactado</SelectItem>
                          <SelectItem value="quoted">Cotizado</SelectItem>
                          <SelectItem value="closed">Cerrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
