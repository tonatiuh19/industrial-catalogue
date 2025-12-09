import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAdminStore } from "@/store/AdminStoreContext";
import { brandsApi } from "@/services/api.service";
import { brandValidationSchema } from "@/lib/validationSchemas";
import type { Brand } from "@shared/api";

interface BrandDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brand?: Brand | null;
}

interface BrandFormValues {
  name: string;
  manufacturer_id: number | string;
  description: string;
}

export default function BrandDialog({
  open,
  onClose,
  onSuccess,
  brand,
}: BrandDialogProps) {
  const { state } = useAdminStore();
  const { reference } = state;
  const { toast } = useToast();
  const isEditMode = !!brand;

  const initialValues: BrandFormValues = {
    name: brand?.name || "",
    manufacturer_id: brand?.manufacturer_id || "",
    description: brand?.description || "",
  };

  const handleSubmit = async (
    values: BrandFormValues,
    { setSubmitting }: FormikHelpers<BrandFormValues>,
  ) => {
    try {
      const data = {
        ...values,
        manufacturer_id: Number(values.manufacturer_id),
      };
      if (isEditMode && brand) {
        await brandsApi.update(brand.id, data);
        toast({
          title: "Éxito",
          description: "Marca actualizada exitosamente",
        });
      } else {
        await brandsApi.create(data);
        toast({
          title: "Éxito",
          description: "Marca creada exitosamente",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Error al ${isEditMode ? "actualizar" : "crear"} la marca`,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <Formik
          initialValues={initialValues}
          validationSchema={brandValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Editar Marca" : "Agregar Nueva Marca"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Actualiza la información de la marca"
                    : "Crea una nueva marca bajo un fabricante"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre de la Marca <span className="text-red-500">*</span>
                  </Label>
                  <Field name="name">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        id="name"
                        placeholder="e.g., PowerMax"
                      />
                    )}
                  </Field>
                  {errors.name && touched.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">
                    Fabricante <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={values.manufacturer_id.toString()}
                    onValueChange={(value) =>
                      setFieldValue("manufacturer_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un fabricante" />
                    </SelectTrigger>
                    <SelectContent>
                      {reference.manufacturers.map((mfg) => (
                        <SelectItem key={mfg.id} value={mfg.id.toString()}>
                          {mfg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.manufacturer_id && touched.manufacturer_id && (
                    <p className="text-sm text-red-500">
                      {errors.manufacturer_id}
                    </p>
                  )}
                  {reference.manufacturers.length === 0 && (
                    <p className="text-xs text-amber-600">
                      No hay fabricantes disponibles. Crea uno primero.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Field name="description">
                    {({ field }: any) => (
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Descripción breve de la marca"
                        rows={3}
                      />
                    )}
                  </Field>
                  {errors.description && touched.description && (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? isEditMode
                      ? "Actualizando..."
                      : "Creando..."
                    : isEditMode
                      ? "Actualizar Marca"
                      : "Crear Marca"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
