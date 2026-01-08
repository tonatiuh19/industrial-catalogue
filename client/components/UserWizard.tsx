import React from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAdminStore } from "@/store/AdminStoreContext";

interface UserWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any | null;
}

interface UserFormValues {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: "admin" | "super_admin";
  is_active: boolean;
}

const userValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
  first_name: Yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es requerido"),
  last_name: Yup.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .required("El apellido es requerido"),
  phone: Yup.string()
    .matches(/^[0-9+\-\s()]*$/, "Formato de teléfono inválido")
    .min(10, "El teléfono debe tener al menos 10 dígitos"),
  role: Yup.string()
    .oneOf(["admin", "super_admin"], "Rol inválido")
    .required("El rol es requerido"),
});

export default function UserWizard({
  open,
  onClose,
  onSuccess,
  user,
}: UserWizardProps) {
  const { toast } = useToast();
  const { createAdminUser, updateAdminUser } = useAdminStore();
  const isEditMode = !!user;

  const initialValues: UserFormValues = {
    email: user?.email || "",
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone: user?.phone || "",
    role: user?.role || "admin",
    is_active: user?.is_active ?? true,
  };

  const handleSubmit = async (
    values: UserFormValues,
    { setSubmitting }: FormikHelpers<UserFormValues>,
  ) => {
    try {
      if (isEditMode && user) {
        await updateAdminUser(user.id, values);
      } else {
        await createAdminUser(values);
      }

      toast({
        title: "Éxito",
        description: `Usuario ${isEditMode ? "actualizado" : "creado"} exitosamente`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("User operation error:", error);

      let errorMessage = `Error al ${isEditMode ? "actualizar" : "crear"} el usuario`;

      if (error.message) {
        errorMessage = error.message;
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
      <DialogContent className="max-w-2xl">
        <Formik
          initialValues={initialValues}
          validationSchema={userValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <DialogHeader>
                <DialogTitle>
                  {isEditMode ? "Editar Usuario" : "Agregar Nuevo Usuario"}
                </DialogTitle>
                <DialogDescription>
                  {isEditMode
                    ? "Modifica los detalles del usuario administrador"
                    : "Crea una nueva cuenta de administrador"}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </Label>
                  <Field
                    as={Input}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    disabled={isEditMode}
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* First Name and Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first_name">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="first_name"
                      name="first_name"
                      placeholder="Nombre"
                    />
                    {errors.first_name && touched.first_name && (
                      <p className="text-sm text-red-500">
                        {errors.first_name}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="last_name">
                      Apellido <span className="text-red-500">*</span>
                    </Label>
                    <Field
                      as={Input}
                      id="last_name"
                      name="last_name"
                      placeholder="Apellido"
                    />
                    {errors.last_name && touched.last_name && (
                      <p className="text-sm text-red-500">{errors.last_name}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Field
                    as={Input}
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+52 123 456 7890"
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* Role */}
                <div className="grid gap-2">
                  <Label htmlFor="role">
                    Rol <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={values.role}
                    onValueChange={(value) => setFieldValue("role", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="super_admin">
                        Super Administrador
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && touched.role && (
                    <p className="text-sm text-red-500">{errors.role}</p>
                  )}
                </div>

                {/* Active Status */}
                {isEditMode && (
                  <div className="flex items-center space-x-2">
                    <Field
                      type="checkbox"
                      id="is_active"
                      name="is_active"
                      checked={values.is_active}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFieldValue("is_active", e.target.checked)
                      }
                      className="h-4 w-4"
                    />
                    <Label htmlFor="is_active">Usuario activo</Label>
                  </div>
                )}

                {!isEditMode && (
                  <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-medium mb-1">Nota importante:</p>
                    <p>
                      El usuario recibirá un código de verificación en su correo
                      electrónico para activar su cuenta.
                    </p>
                  </div>
                )}
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
                    ? "Guardando..."
                    : isEditMode
                      ? "Actualizar"
                      : "Crear Usuario"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
