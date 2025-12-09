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
import { modelsApi } from "@/services/api.service";
import { modelValidationSchema } from "@/lib/validationSchemas";
import type { Model } from "@shared/api";

interface ModelDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  model?: Model | null;
}

interface ModelFormValues {
  name: string;
  brand_id: number | string;
  description: string;
}

export default function ModelDialog({
  open,
  onClose,
  onSuccess,
  model,
}: ModelDialogProps) {
  const { state } = useAdminStore();
  const { reference } = state;
  const { toast } = useToast();
  const isEditMode = !!model;

  const initialValues: ModelFormValues = {
    name: model?.name || "",
    brand_id: model?.brand_id || "",
    description: model?.description || "",
  };

  const handleSubmit = async (
    values: ModelFormValues,
    { setSubmitting }: FormikHelpers<ModelFormValues>,
  ) => {
    try {
      const data = {
        ...values,
        brand_id: Number(values.brand_id),
      };
      if (isEditMode && model) {
        await modelsApi.update(model.id, data);
        toast({
          title: "Éxito",
          description: "Modelo actualizado exitosamente",
        });
      } else {
        await modelsApi.create(data);
        toast({
          title: "Éxito",
          description: "Modelo creado exitosamente",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Error al ${isEditMode ? "actualizar" : "crear"} el modelo`,
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
          validationSchema={modelValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting, setFieldValue, values }) => (
            <Form>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Editar Modelo" : "Agregar Nuevo Modelo"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Actualiza la información del modelo"
                    : "Crea un nuevo modelo de producto bajo una marca"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre del Modelo <span className="text-red-500">*</span>
                  </Label>
                  <Field name="name">
                    {({ field }: any) => (
                      <Input {...field} id="name" placeholder="e.g., DP-1000" />
                    )}
                  </Field>
                  {errors.name && touched.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">
                    Marca <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={values.brand_id.toString()}
                    onValueChange={(value) => setFieldValue("brand_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {reference.brands.map((brand) => {
                        const manufacturer = reference.manufacturers.find(
                          (m) => m.id === brand.manufacturer_id,
                        );
                        return (
                          <SelectItem
                            key={brand.id}
                            value={brand.id.toString()}
                          >
                            {brand.name}{" "}
                            {manufacturer && `(${manufacturer.name})`}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.brand_id && touched.brand_id && (
                    <p className="text-sm text-red-500">{errors.brand_id}</p>
                  )}
                  {reference.brands.length === 0 && (
                    <p className="text-xs text-amber-600">
                      No hay marcas disponibles. Crea una primero.
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
                        placeholder="Descripción breve o especificaciones del modelo"
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
                      ? "Actualizar Modelo"
                      : "Crear Modelo"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
