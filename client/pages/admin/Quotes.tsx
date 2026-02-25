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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Loader2,
  Eye,
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  Package,
  MapPin,
  Calendar,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { AdminQuote } from "@/store/adminState";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  sent: "bg-purple-100 text-purple-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-gray-100 text-gray-800",
};

export default function Quotes() {
  const { state, fetchAdminQuotes, updateQuoteStatus } = useAdminStore();
  const { quotes: quotesState } = state;
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedQuote, setSelectedQuote] = useState<AdminQuote | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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
      // Reload quotes after updating status
      await loadQuotes();
      toast({
        title: "Éxito",
        description: "Estado de la cotización actualizado exitosamente",
      });
    } catch (error: any) {
      console.error("Error updating quote status:", error);
      toast({
        title: "Error",
        description:
          error.message || "Error al actualizar el estado de la cotización",
        variant: "destructive",
      });
    }
  };

  const handleViewQuote = (quote: AdminQuote) => {
    setSelectedQuote(quote);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleDateString("es-ES");
    } catch {
      return "-";
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "processing":
        return "Procesando";
      case "sent":
        return "Enviado";
      case "accepted":
        return "Aceptado";
      case "rejected":
        return "Rechazado";
      case "expired":
        return "Expirado";
      default:
        return status;
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
            <SelectItem value="processing">Procesando</SelectItem>
            <SelectItem value="sent">Enviado</SelectItem>
            <SelectItem value="accepted">Aceptado</SelectItem>
            <SelectItem value="rejected">Rechazado</SelectItem>
            <SelectItem value="expired">Expirado</SelectItem>
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">Fecha</TableHead>
                    <TableHead className="min-w-[200px]">Cliente</TableHead>
                    <TableHead className="min-w-[200px]">Producto</TableHead>
                    <TableHead className="min-w-[100px]">Cantidad</TableHead>
                    <TableHead className="min-w-[140px]">Estado</TableHead>
                    <TableHead className="text-right min-w-[100px]">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotesState.quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>{formatDate(quote.created_at)}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {quote.customer_name || "-"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {quote.customer_email || "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {quote.product_type || quote.brand || "-"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {quote.part_number || "-"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{quote.quantity || "-"}</TableCell>
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
                              {formatStatus(quote.status)}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pendiente</SelectItem>
                            <SelectItem value="processing">
                              Procesando
                            </SelectItem>
                            <SelectItem value="sent">Enviado</SelectItem>
                            <SelectItem value="accepted">Aceptado</SelectItem>
                            <SelectItem value="rejected">Rechazado</SelectItem>
                            <SelectItem value="expired">Expirado</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewQuote(quote)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quote Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Detalle de Cotización #{selectedQuote?.quote_number}
            </DialogTitle>
          </DialogHeader>

          {selectedQuote && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Nombre</p>
                      <p className="font-medium">
                        {selectedQuote.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">Email</p>
                      <p className="font-medium">
                        {selectedQuote.customer_email}
                      </p>
                    </div>
                  </div>
                  {selectedQuote.customer_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Teléfono</p>
                        <p className="font-medium">
                          {selectedQuote.customer_phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedQuote.customer_company && (
                    <div className="flex items-center gap-3">
                      <Building className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Empresa</p>
                        <p className="font-medium">
                          {selectedQuote.customer_company}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedQuote.city_state && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-slate-500" />
                      <div>
                        <p className="text-sm text-slate-600">Ciudad/Estado</p>
                        <p className="font-medium">
                          {selectedQuote.city_state}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-sm text-slate-600">
                        Método de Contacto
                      </p>
                      <p className="font-medium capitalize">
                        {selectedQuote.preferred_contact_method}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Información del Producto
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedQuote.brand && (
                    <div>
                      <p className="text-sm text-slate-600">Marca</p>
                      <p className="font-medium">{selectedQuote.brand}</p>
                    </div>
                  )}
                  {selectedQuote.product_type && (
                    <div>
                      <p className="text-sm text-slate-600">Tipo de Producto</p>
                      <p className="font-medium">
                        {selectedQuote.product_type}
                      </p>
                    </div>
                  )}
                  {selectedQuote.part_number && (
                    <div>
                      <p className="text-sm text-slate-600">Número de Parte</p>
                      <p className="font-medium">{selectedQuote.part_number}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-slate-600">Cantidad</p>
                    <p className="font-medium">{selectedQuote.quantity}</p>
                  </div>
                  {selectedQuote.category_name && (
                    <div>
                      <p className="text-sm text-slate-600">Categoría</p>
                      <p className="font-medium">
                        {selectedQuote.category_name}
                      </p>
                    </div>
                  )}
                  {selectedQuote.subcategory_name && (
                    <div>
                      <p className="text-sm text-slate-600">Subcategoría</p>
                      <p className="font-medium">
                        {selectedQuote.subcategory_name}
                      </p>
                    </div>
                  )}
                  {selectedQuote.manufacturer_name && (
                    <div>
                      <p className="text-sm text-slate-600">Fabricante</p>
                      <p className="font-medium">
                        {selectedQuote.manufacturer_name}
                      </p>
                    </div>
                  )}
                  {selectedQuote.brand_name && (
                    <div>
                      <p className="text-sm text-slate-600">
                        Marca (Relacionada)
                      </p>
                      <p className="font-medium">{selectedQuote.brand_name}</p>
                    </div>
                  )}
                </div>
                {selectedQuote.specifications && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-600 mb-2">
                      Especificaciones
                    </p>
                    <p className="bg-white p-3 rounded border text-sm">
                      {selectedQuote.specifications}
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Información Adicional
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Estado</p>
                    <Badge
                      className={
                        statusColors[
                          selectedQuote.status as keyof typeof statusColors
                        ]
                      }
                    >
                      {formatStatus(selectedQuote.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Fecha de Creación</p>
                    <p className="font-medium">
                      {new Date(selectedQuote.created_at).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">
                      Última Actualización
                    </p>
                    <p className="font-medium">
                      {new Date(selectedQuote.updated_at).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>
                {selectedQuote.customer_message && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-600 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Mensaje del Cliente
                    </p>
                    <p className="bg-white p-3 rounded border text-sm">
                      {selectedQuote.customer_message}
                    </p>
                  </div>
                )}
                {selectedQuote.notes && (
                  <div className="mt-4">
                    <p className="text-sm text-slate-600 mb-2">
                      Notas Internas
                    </p>
                    <p className="bg-white p-3 rounded border text-sm">
                      {selectedQuote.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
