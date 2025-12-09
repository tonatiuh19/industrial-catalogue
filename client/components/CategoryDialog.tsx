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
import { categoriesApi } from "@/services/api.service";
import { categoryValidationSchema } from "@/lib/validationSchemas";
import type { Category } from "@shared/api";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Category | null;
}

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
}

export default function CategoryDialog({
  open,
  onClose,
  onSuccess,
  category,
}: CategoryDialogProps) {
  const { toast } = useToast();
  const isEditMode = !!category;

  const initialValues: CategoryFormValues = {
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (
    values: CategoryFormValues,
    { setSubmitting }: FormikHelpers<CategoryFormValues>,
  ) => {
    try {
      if (isEditMode && category) {
        await categoriesApi.update(category.id, values);
        toast({
          title: "Éxito",
          description: "Categoría actualizada exitosamente",
        });
      } else {
        await categoriesApi.create(values);
        toast({
          title: "Éxito",
          description: "Categoría creada exitosamente",
        });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Error al ${isEditMode ? "actualizar" : "crear"} la categoría`,
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
          validationSchema={categoryValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Editar Categoría" : "Agregar Nueva Categoría"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Actualiza la información de la categoría"
                    : "Crea una nueva categoría de producto para tu catálogo"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Nombre de la Categoría{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Field name="name">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        id="name"
                        placeholder="ej., Herramientas Industriales"
                        onChange={(e) => {
                          field.onChange(e);
                          setFieldValue("slug", generateSlug(e.target.value));
                        }}
                      />
                    )}
                  </Field>
                  {errors.name && touched.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">
                    Slug <span className="text-red-500">*</span>
                  </Label>
                  <Field name="slug">
                    {({ field }: any) => (
                      <Input
                        {...field}
                        id="slug"
                        placeholder="industrial-tools"
                      />
                    )}
                  </Field>
                  {errors.slug && touched.slug && (
                    <p className="text-sm text-red-500">{errors.slug}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Identificador amigable para URL (auto-generado desde el
                    nombre)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Field name="description">
                    {({ field }: any) => (
                      <Textarea
                        {...field}
                        id="description"
                        placeholder="Descripción breve de esta categoría"
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
                      ? "Actualizar Categoría"
                      : "Crear Categoría"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
