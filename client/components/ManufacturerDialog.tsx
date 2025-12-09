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
import { useToast } from "@/hooks/use-toast";
import { manufacturersApi } from "@/services/api.service";
import { manufacturerValidationSchema } from "@/lib/validationSchemas";
import type { Manufacturer } from "@shared/api";

interface ManufacturerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  manufacturer?: Manufacturer | null;
}

interface ManufacturerFormValues {
  name: string;
  description: string;
  website: string;
}

export default function ManufacturerDialog({
  open,
  onClose,
  onSuccess,
  manufacturer,
}: ManufacturerDialogProps) {
  const { toast } = useToast();
  const isEditMode = !!manufacturer;

  const initialValues: ManufacturerFormValues = {
    name: manufacturer?.name || "",
    description: manufacturer?.description || "",
    website: manufacturer?.website || "",
  };

  const handleSubmit = async (
    values: ManufacturerFormValues,
    { setSubmitting }: FormikHelpers<ManufacturerFormValues>,
  ) => {
    try {
      if (isEditMode && manufacturer) {
        await manufacturersApi.update(manufacturer.id, values);
        toast({
          title: "Éxito",
          description: "Fabricante actualizado exitosamente",
        });
      } else {
        await manufacturersApi.create(values);
        toast({
          title: "Éxito",
          description: "Fabricante creado exitosamente",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Error al ${isEditMode ? "actualizar" : "crear"} el fabricante`,
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
          validationSchema={manufacturerValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode
                    ? "Editar Fabricante"
                    : "Agregar Nuevo Fabricante"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Actualiza la información del fabricante"
                    : "Crea un nuevo fabricante para tus productos"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre del Fabricante{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field name="name">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        id="name"
                        placeholder="ej., Industrias ProTech"
                      />
                    )}
                  </Field>
                  {errors.name && touched.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Sitio Web (Opcional)</Label>
                  <Field name="website">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        id="website"
                        type="url"
                        placeholder="https://ejemplo.com"
                      />
                    )}
                  </Field>
                  {errors.website && touched.website && (
                    <p className="text-sm text-red-500">{errors.website}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Field name="description">
                    {({ field }: any) => (
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Descripción breve del fabricante"
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
                      ? "Actualizar Fabricante"
                      : "Crear Fabricante"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
