import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Tag,
  Factory,
  Layers,
  Image as ImageIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  categoriesApi,
  manufacturersApi,
  brandsApi,
  subcategoriesApi,
} from "@/services/api.service";
import { ImageUploadStep } from "@/components/ImageUploadStep";
import {
  generateTempId,
  uploadCategoryImages,
  uploadSubcategoryImages,
  uploadManufacturerImages,
  uploadBrandImages,
} from "@/services/image-upload.service";
import { useAdminStore } from "@/store/AdminStoreContext";
import type { Category, Manufacturer, Brand, Subcategory } from "@shared/api";

type EntityType = "category" | "manufacturer" | "brand" | "subcategory";
type Entity = Category | Manufacturer | Brand | Subcategory;

interface ReferenceDataWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: EntityType;
  entity?: Entity | null;
}

interface FormValues {
  name: string;
  slug?: string;
  description: string;
  website?: string;
  manufacturer_id?: number | string;
  category_id?: number | string;
  subcategory_id?: number | string;
}

const getEntityConfig = (type: EntityType) => {
  switch (type) {
    case "category":
      return {
        title: "Categoría",
        icon: Tag,
        api: categoriesApi,
        hasSlug: true,
        hasWebsite: false,
        hasManufacturer: false,
        hasCategory: false,
        hasSubcategory: false,
      };
    case "subcategory":
      return {
        title: "Subcategoría",
        icon: Tag,
        api: subcategoriesApi,
        hasSlug: true,
        hasWebsite: false,
        hasManufacturer: false,
        hasCategory: true, // Subcategory requires parent category
        hasSubcategory: false,
      };
    case "manufacturer":
      return {
        title: "Fabricante",
        icon: Factory,
        api: manufacturersApi,
        hasSlug: false,
        hasWebsite: true,
        hasManufacturer: false,
        hasCategory: true,
        hasSubcategory: true,
      };
    case "brand":
      return {
        title: "Marca",
        icon: Layers,
        api: brandsApi,
        hasSlug: false,
        hasWebsite: false,
        hasManufacturer: true,
        hasCategory: true,
        hasSubcategory: true,
      };
  }
};

export default function ReferenceDataWizard({
  open,
  onClose,
  onSuccess,
  type,
  entity,
}: ReferenceDataWizardProps) {
  const { toast } = useToast();
  const { state } = useAdminStore();
  const { reference } = state;
  const isEditMode = !!entity;
  const [step, setStep] = useState(1);
  const config = getEntityConfig(type);

  // Image management
  const [entityId, setEntityId] = useState<string>(
    entity?.id ? String(entity.id) : generateTempId(),
  );
  const [mainImage, setMainImage] = useState<string | null>(
    entity?.main_image || null,
  );
  const [extraImages, setExtraImages] = useState<string[]>(
    entity?.extra_images ? JSON.parse(entity.extra_images) : [],
  );
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (entity?.id) {
      setEntityId(String(entity.id));
      setMainImage(entity.main_image || null);
      setExtraImages(
        entity.extra_images ? JSON.parse(entity.extra_images) : [],
      );
      setMainImageFile(null);
      setExtraImageFiles([]);
    } else {
      setEntityId(generateTempId());
      setMainImage(null);
      setExtraImages([]);
      setMainImageFile(null);
      setExtraImageFiles([]);
    }
    setStep(1);
  }, [entity, open]);

  const getInitialValues = (): FormValues => {
    const base: FormValues = {
      name: entity?.name || "",
      description: entity?.description || "",
    };

    if (config.hasSlug) {
      base.slug = (entity as Category)?.slug || "";
    }

    if (config.hasWebsite) {
      base.website = (entity as Manufacturer)?.website || "";
    }

    if (config.hasManufacturer) {
      base.manufacturer_id = (entity as Brand)?.manufacturer_id || "";
    }

    return base;
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  const getValidationSchema = () => {
    if (step === 1) {
      const schema: any = {
        name: Yup.string()
          .required(`El nombre del ${config.title.toLowerCase()} es requerido`)
          .min(2, "El nombre debe tener al menos 2 caracteres"),
        description: Yup.string(),
      };

      if (config.hasSlug) {
        schema.slug = Yup.string()
          .required("El slug es requerido")
          .matches(
            /^[a-z0-9-]+$/,
            "El slug solo puede contener letras minúsculas, números y guiones",
          );
      }

      if (config.hasWebsite) {
        schema.website = Yup.string().url("Debe ser una URL válida");
      }

      if (config.hasManufacturer) {
        schema.manufacturer_id = Yup.number()
          .required("El fabricante es requerido")
          .positive("Selecciona un fabricante válido");
      }

      return Yup.object(schema);
    }

    if (step === 2) {
      return Yup.object({
        mainImage: Yup.mixed().test(
          "main-image-required",
          "La imagen principal es requerida",
          () => mainImage !== null || mainImageFile !== null,
        ),
      });
    }

    return Yup.object();
  };

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>,
  ) => {
    console.log(`[ReferenceDataWizard] handleSubmit called for type: ${type}`);
    console.log(`[ReferenceDataWizard] isEditMode: ${isEditMode}`);
    console.log(
      `[ReferenceDataWizard] Form values:`,
      JSON.stringify(values, null, 2),
    );
    console.log(`[ReferenceDataWizard] Entity:`, entity);

    try {
      // Validate main image
      if (!mainImage && !mainImageFile) {
        console.log(
          `[ReferenceDataWizard] Missing main image validation failed`,
        );
        toast({
          title: "Error",
          description: "La imagen principal es requerida",
          variant: "destructive",
        });
        setSubmitting(false);
        return;
      }

      // Validate slug for categories
      if (type === "category" && !isEditMode && values.slug) {
        try {
          const response = await categoriesApi.validateSlug(values.slug);
          const data = response.data as {
            success: boolean;
            available?: boolean;
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
        } catch (slugError) {
          console.error("Error validating slug:", slugError);
        }
      }

      let finalMainImage = mainImage;
      let finalExtraImages = extraImages;

      // Upload images if there are new files
      if (mainImageFile || extraImageFiles.length > 0) {
        try {
          // Use appropriate upload function based on entity type
          let result;
          switch (type) {
            case "category":
              result = await uploadCategoryImages(
                entityId,
                mainImageFile || undefined,
                extraImageFiles.length > 0 ? extraImageFiles : undefined,
              );
              break;
            case "subcategory":
              result = await uploadSubcategoryImages(
                entityId,
                mainImageFile || undefined,
                extraImageFiles.length > 0 ? extraImageFiles : undefined,
              );
              break;
            case "manufacturer":
              result = await uploadManufacturerImages(
                entityId,
                mainImageFile || undefined,
                extraImageFiles.length > 0 ? extraImageFiles : undefined,
              );
              break;
            case "brand":
              result = await uploadBrandImages(
                entityId,
                mainImageFile || undefined,
                extraImageFiles.length > 0 ? extraImageFiles : undefined,
              );
              break;
            default:
              throw new Error(`Unsupported entity type: ${type}`);
          }

          if (!result.success) {
            toast({
              title: "Error",
              description: result.error || "Error al subir las imágenes",
              variant: "destructive",
            });
            setSubmitting(false);
            return;
          }

          if (result.main_image) {
            finalMainImage = result.main_image.path;
          }
          if (result.extra_images && result.extra_images.length > 0) {
            const newPaths = result.extra_images.map((img) => img.path);
            finalExtraImages = [...extraImages, ...newPaths];
          }
        } catch (uploadError: any) {
          toast({
            title: "Error al subir imágenes",
            description: uploadError.message || "Error al subir las imágenes",
            variant: "destructive",
          });
          setSubmitting(false);
          return;
        }
      }

      const entityData: any = {
        ...values,
        main_image: finalMainImage,
        extra_images:
          finalExtraImages.length > 0 ? JSON.stringify(finalExtraImages) : null,
      };

      console.log(
        `[ReferenceDataWizard] Prepared entityData:`,
        JSON.stringify(entityData, null, 2),
      );
      console.log(`[ReferenceDataWizard] Config API:`, config.api);

      // Convert manufacturer_id to number for brands
      if (config.hasManufacturer && entityData.manufacturer_id) {
        entityData.manufacturer_id = Number(entityData.manufacturer_id);
        console.log(
          `[ReferenceDataWizard] Converted manufacturer_id to:`,
          entityData.manufacturer_id,
        );
      }

      // Convert category_id to number for subcategories
      if (config.hasCategory && entityData.category_id) {
        entityData.category_id = Number(entityData.category_id);
        console.log(
          `[ReferenceDataWizard] Converted category_id to:`,
          entityData.category_id,
        );
      }

      console.log(
        `[ReferenceDataWizard] Final entityData before API call:`,
        JSON.stringify(entityData, null, 2),
      );

      if (isEditMode && entity) {
        console.log(
          `[ReferenceDataWizard] Calling update API for ID:`,
          entity.id,
        );
        const updateResult = await config.api.update(entity.id, entityData);
        console.log(`[ReferenceDataWizard] Update API result:`, updateResult);
        toast({
          title: "Éxito",
          description: `${config.title} actualizado exitosamente`,
        });
      } else {
        console.log(`[ReferenceDataWizard] Calling create API`);
        const createResult = await config.api.create(entityData);
        console.log(`[ReferenceDataWizard] Create API result:`, createResult);
        toast({
          title: "Éxito",
          description: `${config.title} creado exitosamente`,
        });
      }

      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error(`[ReferenceDataWizard] ${config.title} operation error:`, {
        error: error,
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack,
      });

      let errorMessage = `Error al ${isEditMode ? "actualizar" : "crear"} ${config.title.toLowerCase()}`;

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        console.error(
          `[ReferenceDataWizard] HTTP Error - Status: ${status}, Data:`,
          data,
        );

        if (status === 503) {
          errorMessage =
            "Error de conexión con la base de datos. Por favor intenta de nuevo.";
        } else if (status === 504) {
          errorMessage =
            "La operación tardó demasiado. Por favor intenta de nuevo.";
        } else if (status === 409) {
          errorMessage =
            type === "category"
              ? "Este slug ya existe. Por favor elige otro nombre."
              : `Este ${config.title.toLowerCase()} ya existe.`;
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

      console.error(`[ReferenceDataWizard] Final error message:`, errorMessage);

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const progress = (step / 3) * 100;
  const EntityIcon = config.icon;

  const steps = [
    { number: 1, title: "Información", icon: EntityIcon },
    { number: 2, title: "Imágenes", icon: ImageIcon },
    { number: 3, title: "Revisar", icon: Check },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <Formik
          initialValues={getInitialValues()}
          validationSchema={getValidationSchema()}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
            validateForm,
          }) => {
            const handleNext = async (e?: React.MouseEvent) => {
              e?.preventDefault();
              e?.stopPropagation();

              // Step 2 (images) needs manual validation
              if (step === 2) {
                if (!mainImage && !mainImageFile) {
                  toast({
                    title: "Imagen requerida",
                    description: "Debes agregar al menos una imagen principal",
                    variant: "destructive",
                  });
                  return;
                }
                setStep(step + 1);
                return;
              }

              const stepErrors = await validateForm();
              const hasErrors = Object.keys(stepErrors).length > 0;

              if (!hasErrors) {
                setStep(step + 1);
              }
            };

            const handleBack = (e?: React.MouseEvent) => {
              e?.preventDefault();
              e?.stopPropagation();
              setStep(step - 1);
            };

            return (
              <Form>
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode
                      ? `Editar ${config.title}`
                      : `Nuevo ${config.title}`}
                  </DialogTitle>
                  <DialogDescription>
                    Paso {step} de 3: {steps[step - 1].title}
                  </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="py-4">
                  <div className="relative w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-primary transition-all duration-300 ease-in-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    {steps.map((s) => {
                      const StepIcon = s.icon;
                      return (
                        <div
                          key={s.number}
                          className={`flex flex-col items-center text-xs ${
                            step >= s.number
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        >
                          <StepIcon className="h-4 w-4 mb-1" />
                          <span className="hidden sm:inline">{s.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <EntityIcon className="h-5 w-5" />
                        Información de {config.title}
                      </CardTitle>
                      <CardDescription>
                        Completa la información básica
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Nombre <span className="text-red-500">*</span>
                        </Label>
                        <Field name="name">
                          {({ field }: any) => (
                            <Input
                              {...field}
                              id="name"
                              placeholder={`ej., ${type === "category" ? "Herramientas Industriales" : type === "manufacturer" ? "Industrias ProTech" : "PowerMax"}`}
                              onChange={(e) => {
                                field.onChange(e);
                                if (config.hasSlug) {
                                  setFieldValue(
                                    "slug",
                                    generateSlug(e.target.value),
                                  );
                                }
                              }}
                            />
                          )}
                        </Field>
                        {errors.name && touched.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>

                      {/* Slug Field (Categories only) */}
                      {config.hasSlug && (
                        <div className="space-y-2">
                          <Label htmlFor="slug">
                            Slug <span className="text-red-500">*</span>
                          </Label>
                          <Field name="slug">
                            {({ field }: any) => (
                              <Input
                                {...field}
                                id="slug"
                                placeholder="herramientas-industriales"
                              />
                            )}
                          </Field>
                          {errors.slug && touched.slug && (
                            <p className="text-sm text-red-500">
                              {errors.slug}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            URL amigable (auto-generado desde el nombre)
                          </p>
                        </div>
                      )}

                      {/* Website Field (Manufacturers only) */}
                      {config.hasWebsite && (
                        <div className="space-y-2">
                          <Label htmlFor="website">Sitio Web</Label>
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
                            <p className="text-sm text-red-500">
                              {errors.website}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Manufacturer Select (Brands only) */}
                      {config.hasManufacturer && (
                        <div className="space-y-2">
                          <Label htmlFor="manufacturer">
                            Fabricante <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={values.manufacturer_id?.toString() || ""}
                            onValueChange={(value) =>
                              setFieldValue("manufacturer_id", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un fabricante" />
                            </SelectTrigger>
                            <SelectContent>
                              {reference.manufacturers.map((mfg) => (
                                <SelectItem
                                  key={mfg.id}
                                  value={mfg.id.toString()}
                                >
                                  {mfg.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.manufacturer_id &&
                            touched.manufacturer_id && (
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
                      )}

                      {/* Description Field */}
                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Field name="description">
                          {({ field }: any) => (
                            <Textarea
                              {...field}
                              id="description"
                              placeholder="Descripción breve"
                              rows={3}
                            />
                          )}
                        </Field>
                        {errors.description && touched.description && (
                          <p className="text-sm text-red-500">
                            {errors.description}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Images */}
                {step === 2 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Imágenes
                      </CardTitle>
                      <CardDescription>
                        La imagen principal es obligatoria. Las imágenes
                        adicionales son opcionales.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ImageUploadStep
                        productId={entityId}
                        mainImage={mainImage}
                        extraImages={extraImages}
                        mainImageFile={mainImageFile}
                        extraImageFiles={extraImageFiles}
                        onMainImageChange={setMainImage}
                        onExtraImagesChange={setExtraImages}
                        onMainImageFileChange={setMainImageFile}
                        onExtraImageFilesChange={setExtraImageFiles}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        Revisar Información
                      </CardTitle>
                      <CardDescription>
                        Verifica que todo esté correcto antes de guardar
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Información Básica</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">Nombre:</div>
                          <div className="font-medium">{values.name}</div>

                          {config.hasSlug && (
                            <>
                              <div className="text-muted-foreground">Slug:</div>
                              <div className="font-medium">{values.slug}</div>
                            </>
                          )}

                          {config.hasWebsite && (
                            <>
                              <div className="text-muted-foreground">
                                Sitio Web:
                              </div>
                              <div className="font-medium">
                                {values.website || "-"}
                              </div>
                            </>
                          )}

                          {config.hasManufacturer && (
                            <>
                              <div className="text-muted-foreground">
                                Fabricante:
                              </div>
                              <div className="font-medium">
                                {reference.manufacturers.find(
                                  (m) =>
                                    m.id === Number(values.manufacturer_id),
                                )?.name || "-"}
                              </div>
                            </>
                          )}

                          <div className="text-muted-foreground">
                            Descripción:
                          </div>
                          <div className="font-medium">
                            {values.description || "-"}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold">Imágenes</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-muted-foreground">
                            Imagen Principal:
                          </div>
                          <div className="font-medium">
                            {mainImage || mainImageFile
                              ? "✓ Agregada"
                              : "✗ Sin imagen"}
                          </div>
                          <div className="text-muted-foreground">
                            Imágenes Extra:
                          </div>
                          <div className="font-medium">
                            {extraImages.length + extraImageFiles.length} imagen
                            {extraImages.length + extraImageFiles.length !== 1
                              ? "es"
                              : ""}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={step === 1 ? handleClose : handleBack}
                    disabled={isSubmitting}
                  >
                    {step === 1 ? (
                      "Cancelar"
                    ) : (
                      <>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Atrás
                      </>
                    )}
                  </Button>

                  {step < 3 ? (
                    <Button type="button" onClick={handleNext}>
                      Siguiente
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting
                        ? "Guardando..."
                        : isEditMode
                          ? `Actualizar ${config.title}`
                          : `Crear ${config.title}`}
                    </Button>
                  )}
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
