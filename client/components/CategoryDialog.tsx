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
      // Validate slug availability before creating (skip for edit mode)
      if (!isEditMode) {
        try {
          const response = await categoriesApi.validateSlug(values.slug);
          const data = response.data as {
            success: boolean;
            available?: boolean;
            message?: string;
          };

          if (data.success && data.available === false) {
            toast({
              title: "Slug no disponible",
              description:
                "Este slug ya está en uso. Por favor elige otro nombre.",
              variant: "destructive",
            });
            setSubmitting(false);
            return;
          }
        } catch (slugError: any) {
          console.error("Error validating slug:", slugError);
          // If validation fails, allow creation to proceed (fail open)
          // The backend will catch duplicate slug errors
        }
      }

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
      console.error("Category operation error:", error);

      let errorMessage = `Error al ${isEditMode ? "actualizar" : "crear"} la categoría`;

      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 503) {
          errorMessage =
            "Error de conexión con la base de datos. Por favor intenta de nuevo.";
        } else if (status === 504) {
          errorMessage =
            "La operación tardó demasiado. Por favor intenta de nuevo.";
        } else if (status === 409) {
          errorMessage = "Este slug ya existe. Por favor elige otro nombre.";
        } else if (data?.message) {
          errorMessage = data.message;
        }
      } else if (
        error.code === "ECONNABORTED" ||
        error.message?.includes("timeout")
      ) {
        errorMessage =
          "Tiempo de espera agotado. Por favor verifica tu conexión.";
      }

      toast({
        title: "Error",
        description: errorMessage,
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
