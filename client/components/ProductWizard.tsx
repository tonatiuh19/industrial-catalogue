import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUploadStep } from "@/components/ImageUploadStep";
import { generateTempId } from "@/services/image-upload.service";
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
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Package,
  Tag,
  Factory,
  Layers,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import { useAdminStore } from "@/store/AdminStoreContext";
import { useToast } from "@/hooks/use-toast";
import { productValidationSchema } from "@/lib/validationSchemas";

interface ProductWizardProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product?: any | null;
}

export default function ProductWizard({
  open,
  onClose,
  onSuccess,
  product,
}: ProductWizardProps) {
  const {
    state,
    createAdminProduct,
    updateAdminProduct,
    fetchAllReferenceData,
    uploadProductImages,
  } = useAdminStore();
  const { reference } = state;
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const isEditMode = !!product;

  // Image management
  const [productId, setProductId] = useState<string>(
    product?.id ? String(product.id) : generateTempId(),
  );
  const [mainImage, setMainImage] = useState<string | null>(
    product?.main_image || null,
  );
  const [extraImages, setExtraImages] = useState<string[]>(
    product?.extra_images ? JSON.parse(product.extra_images) : [],
  );
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);

  useEffect(() => {
    if (product?.id) {
      setProductId(String(product.id));
      setMainImage(product.main_image || null);
      setExtraImages(
        product.extra_images ? JSON.parse(product.extra_images) : [],
      );
      setMainImageFile(null);
      setExtraImageFiles([]);
    } else {
      setProductId(generateTempId());
      setMainImage(null);
      setExtraImages([]);
      setMainImageFile(null);
      setExtraImageFiles([]);
    }
  }, [product]);

  const initialValues = {
    // Step 1: Basic Info
    name: product?.name || "",
    sku: product?.sku || "",
    description: product?.description || "",
    long_description: product?.long_description || "",

    // Step 2: Classification
    category_id: product?.category_id?.toString() || "",
    manufacturer_id: product?.manufacturer_id?.toString() || "",
    brand_id: product?.brand_id?.toString() || "",
    model_id: product?.model_id?.toString() || "",

    // Step 3: Pricing & Inventory
    price: product?.price?.toString() || "",
    stock_quantity: product?.stock_quantity?.toString() || "",
    min_stock_level: product?.min_stock_level?.toString() || "",

    // Additional fields
    is_active: product?.is_active ?? true,
  };

  useEffect(() => {
    if (open) {
      fetchAllReferenceData().catch((err) => console.error(err));
    }
  }, [open]);

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  // Step-specific validation schemas
  const getValidationSchema = () => {
    switch (step) {
      case 1:
        return Yup.object({
          name: Yup.string()
            .required("El nombre del producto es requerido")
            .min(2, "El nombre debe tener al menos 2 caracteres")
            .max(255, "El nombre no debe exceder 255 caracteres"),
          sku: Yup.string()
            .required("El SKU es requerido")
            .min(2, "El SKU debe tener al menos 2 caracteres")
            .max(100, "El SKU no debe exceder 100 caracteres"),
          description: Yup.string()
            .required("La descripción es requerida")
            .min(10, "La descripción debe tener al menos 10 caracteres")
            .max(500, "La descripción no debe exceder 500 caracteres"),
          long_description: Yup.string().max(
            2000,
            "La descripción detallada no debe exceder 2000 caracteres",
          ),
        });
      case 2:
        return Yup.object({
          category_id: Yup.number()
            .required("La categoría es requerida")
            .positive("Por favor selecciona una categoría"),
          manufacturer_id: Yup.number()
            .required("El fabricante es requerido")
            .positive("Por favor selecciona un fabricante"),
          brand_id: Yup.number()
            .required("La marca es requerida")
            .positive("Por favor selecciona una marca"),
          model_id: Yup.number()
            .nullable()
            .positive("Selección de modelo inválida"),
        });
      case 3:
        return Yup.object({
          price: Yup.number()
            .required("El precio es requerido")
            .positive("El precio debe ser mayor a 0")
            .min(0.01, "El precio debe ser al menos 0.01"),
          stock_quantity: Yup.number().min(
            0,
            "La cantidad en stock no puede ser negativa",
          ),
          min_stock_level: Yup.number().min(
            0,
            "El nivel mínimo de stock no puede ser negativo",
          ),
        });
      default:
        return Yup.object();
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      let finalMainImage = mainImage;
      let finalExtraImages = extraImages;

      // Upload images if there are new files
      if (mainImageFile || extraImageFiles.length > 0) {
        try {
          const result = await uploadProductImages(
            productId,
            mainImageFile || undefined,
            extraImageFiles.length > 0 ? extraImageFiles : undefined,
          );

          if (!result.success) {
            toast({
              title: "Error",
              description: result.error || "Error al subir las imágenes",
              variant: "destructive",
            });
            return; // Stop here, don't create product
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
          return; // Stop here, don't create product
        }
      }

      const productData = {
        name: values.name,
        sku: values.sku,
        description: values.description,
        long_description: values.long_description,
        price: parseFloat(values.price as any) || 0,
        stock_quantity: parseInt(values.stock_quantity as any) || 0,
        min_stock_level: parseInt(values.min_stock_level as any) || 0,
        category_id: parseInt(values.category_id as any),
        manufacturer_id: parseInt(values.manufacturer_id as any),
        brand_id: parseInt(values.brand_id as any),
        model_id: values.model_id ? parseInt(values.model_id as any) : null,
        main_image: finalMainImage,
        extra_images:
          finalExtraImages.length > 0 ? JSON.stringify(finalExtraImages) : null,
        is_active: values.is_active,
      };

      if (isEditMode && product) {
        await updateAdminProduct(product.id, productData);
        toast({
          title: "Éxito",
          description: "Producto actualizado exitosamente",
        });
      } else {
        await createAdminProduct(productData);
        toast({
          title: "Éxito",
          description: "Producto creado exitosamente",
        });
      }

      onSuccess();
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message ||
          `Error al ${isEditMode ? "actualizar" : "crear"} el producto`,
        variant: "destructive",
      });
    }
  };

  const progress = (step / 5) * 100;

  const steps = [
    { number: 1, title: "Información Básica", icon: Package },
    { number: 2, title: "Clasificación", icon: Tag },
    { number: 3, title: "Precios e Inventario", icon: DollarSign },
    { number: 4, title: "Imágenes", icon: ImageIcon },
    { number: 5, title: "Revisar y Enviar", icon: Check },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <Formik
          initialValues={initialValues}
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
            const filteredBrands = values.manufacturer_id
              ? reference.brands.filter(
                  (b) =>
                    b.manufacturer_id ===
                    parseInt(values.manufacturer_id as any),
                )
              : reference.brands;

            const filteredModels = values.brand_id
              ? reference.models.filter(
                  (m) => m.brand_id === parseInt(values.brand_id as any),
                )
              : reference.models;

            const progress = (step / 5) * 100;

            const steps = [
              { number: 1, title: "Información Básica", icon: Package },
              { number: 2, title: "Clasificación", icon: Tag },
              { number: 3, title: "Precios e Inventario", icon: DollarSign },
              { number: 4, title: "Imágenes", icon: ImageIcon },
              { number: 5, title: "Revisar y Enviar", icon: Check },
            ];

            const handleNext = async (e?: React.MouseEvent) => {
              e?.preventDefault();
              e?.stopPropagation();

              // Step 4 (images) doesn't need validation, skip to next
              if (step === 4) {
                setStep(step + 1);
                return;
              }

              const stepErrors = await validateForm();

              // Only check errors for fields in the current step
              let hasStepErrors = false;

              if (step === 1) {
                hasStepErrors = [
                  "name",
                  "sku",
                  "description",
                  "long_description",
                ].some((field) => stepErrors[field]);
              } else if (step === 2) {
                hasStepErrors = [
                  "category_id",
                  "manufacturer_id",
                  "brand_id",
                  "model_id",
                ].some((field) => stepErrors[field]);
              } else if (step === 3) {
                hasStepErrors = [
                  "price",
                  "stock_quantity",
                  "min_stock_level",
                ].some((field) => stepErrors[field]);
              }

              if (!hasStepErrors) {
                setStep((prev) => Math.min(prev + 1, 5));
              } else {
                toast({
                  title: "Error de Validación",
                  description:
                    "Por favor corrige los errores antes de continuar",
                  variant: "destructive",
                });
              }
            };

            const handlePrev = () => {
              setStep((prev) => Math.max(prev - 1, 1));
            };

            return (
              <Form
                onKeyDown={(e) => {
                  // Prevent Enter key from submitting the form
                  if (e.key === "Enter" && step !== 5) {
                    e.preventDefault();
                  }
                }}
              >
                <DialogHeader className="pb-4">
                  <DialogTitle>
                    {isEditMode ? "Editar Producto" : "Agregar Nuevo Producto"}
                  </DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Actualiza la información del producto"
                      : "Sigue los pasos para agregar un nuevo producto a tu catálogo"}
                  </DialogDescription>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="space-y-2 pb-6">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {steps.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div
                          key={s.number}
                          className={`flex items-center gap-1 ${step >= s.number ? "text-primary font-medium" : ""}`}
                        >
                          <Icon className="h-3 w-3" />
                          <span className="hidden sm:inline">{s.title}</span>
                          <span className="sm:hidden">Paso {s.number}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 1: Basic Information */}
                {step === 1 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Información Básica del Producto
                      </CardTitle>
                      <CardDescription>
                        Ingresa los detalles principales que identifican tu
                        producto
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">
                          Nombre del Producto{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Field name="name">
                          {({ field }: any) => (
                            <Input
                              {...field}
                              id="name"
                              placeholder="ej., Taladro Industrial"
                            />
                          )}
                        </Field>
                        {errors.name && touched.name && (
                          <p className="text-sm text-red-500">
                            {String(errors.name)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sku">
                          SKU (Clave de Producto){" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Field name="sku">
                          {({ field }: any) => (
                            <Input
                              {...field}
                              id="sku"
                              placeholder="ej., IDP-1000-BLK"
                            />
                          )}
                        </Field>
                        {errors.sku && touched.sku && (
                          <p className="text-sm text-red-500">
                            {String(errors.sku)}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Identificador único para gestión de inventario
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">
                          Descripción Corta{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Field name="description">
                          {({ field }: any) => (
                            <Textarea
                              {...field}
                              id="description"
                              placeholder="Descripción breve del producto (1-2 oraciones)"
                              rows={3}
                            />
                          )}
                        </Field>
                        {errors.description && touched.description && (
                          <p className="text-sm text-red-500">
                            {String(errors.description)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="long_description">
                          Descripción Detallada
                        </Label>
                        <Field name="long_description">
                          {({ field }: any) => (
                            <Textarea
                              {...field}
                              id="long_description"
                              placeholder="Detalles completos del producto, características, especificaciones y casos de uso"
                              rows={5}
                            />
                          )}
                        </Field>
                        {errors.long_description &&
                          touched.long_description && (
                            <p className="text-sm text-red-500">
                              {String(errors.long_description)}
                            </p>
                          )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 2: Classification */}
                {step === 2 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Clasificación del Producto
                      </CardTitle>
                      <CardDescription>
                        Organiza tu producto por categoría, fabricante, marca y
                        modelo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">
                          Categoría <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={values.category_id.toString()}
                          onValueChange={(value) =>
                            setFieldValue("category_id", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {reference.categories.map((cat) => (
                              <SelectItem
                                key={cat.id}
                                value={cat.id.toString()}
                              >
                                {cat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category_id && touched.category_id && (
                          <p className="text-sm text-red-500">
                            {String(errors.category_id)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="manufacturer">
                          Fabricante <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={values.manufacturer_id.toString()}
                          onValueChange={(value) => {
                            setFieldValue("manufacturer_id", value);
                            setFieldValue("brand_id", "");
                            setFieldValue("model_id", "");
                          }}
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
                        {errors.manufacturer_id && touched.manufacturer_id && (
                          <p className="text-sm text-red-500">
                            {String(errors.manufacturer_id)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="brand">
                          Marca <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={values.brand_id.toString()}
                          onValueChange={(value) => {
                            setFieldValue("brand_id", value);
                            setFieldValue("model_id", "");
                          }}
                          disabled={!values.manufacturer_id}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                values.manufacturer_id
                                  ? "Selecciona una marca"
                                  : "Selecciona fabricante primero"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredBrands.map((brand) => (
                              <SelectItem
                                key={brand.id}
                                value={brand.id.toString()}
                              >
                                {brand.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.brand_id && touched.brand_id && (
                          <p className="text-sm text-red-500">
                            {String(errors.brand_id)}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="model">Modelo (Opcional)</Label>
                        <Select
                          value={
                            values.model_id ? values.model_id.toString() : ""
                          }
                          onValueChange={(value) =>
                            setFieldValue("model_id", value)
                          }
                          disabled={!values.brand_id}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                values.brand_id
                                  ? "Selecciona un modelo"
                                  : "Selecciona marca primero"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {filteredModels.map((model) => (
                              <SelectItem
                                key={model.id}
                                value={model.id.toString()}
                              >
                                {model.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.model_id && touched.model_id && (
                          <p className="text-sm text-red-500">
                            {String(errors.model_id)}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 3: Pricing & Inventory */}
                {step === 3 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Precios e Inventario
                      </CardTitle>
                      <CardDescription>
                        Establece el precio e información de inventario para la
                        gestión
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">
                          Precio (USD) <span className="text-red-500">*</span>
                        </Label>
                        <Field name="price">
                          {({ field }: any) => (
                            <Input
                              {...field}
                              id="price"
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                            />
                          )}
                        </Field>
                        {errors.price && touched.price && (
                          <p className="text-sm text-red-500">
                            {String(errors.price)}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="stock_quantity">
                            Cantidad en Stock
                          </Label>
                          <Field name="stock_quantity">
                            {({ field }: any) => (
                              <Input
                                {...field}
                                id="stock_quantity"
                                type="number"
                                placeholder="0"
                              />
                            )}
                          </Field>
                          {errors.stock_quantity && touched.stock_quantity && (
                            <p className="text-sm text-red-500">
                              {String(errors.stock_quantity)}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Stock disponible actual
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="min_stock_level">
                            Nivel Mínimo de Stock
                          </Label>
                          <Field name="min_stock_level">
                            {({ field }: any) => (
                              <Input
                                {...field}
                                id="min_stock_level"
                                type="number"
                                placeholder="0"
                              />
                            )}
                          </Field>
                          {errors.min_stock_level &&
                            touched.min_stock_level && (
                              <p className="text-sm text-red-500">
                                {String(errors.min_stock_level)}
                              </p>
                            )}
                          <p className="text-xs text-muted-foreground">
                            Umbral de alerta
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Step 4: Images */}
                {step === 4 && (
                  <ImageUploadStep
                    productId={productId}
                    mainImage={mainImage}
                    extraImages={extraImages}
                    mainImageFile={mainImageFile}
                    extraImageFiles={extraImageFiles}
                    onMainImageChange={setMainImage}
                    onExtraImagesChange={setExtraImages}
                    onMainImageFileChange={setMainImageFile}
                    onExtraImageFilesChange={setExtraImageFiles}
                  />
                )}

                {/* Step 5: Review & Submit */}
                {step === 5 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        Revisar Detalles del Producto
                      </CardTitle>
                      <CardDescription>
                        Por favor revisa toda la información antes de enviar
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Información Básica
                          </p>
                          <div className="mt-2 space-y-1 border-l-2 pl-4">
                            <p>
                              <strong>Nombre:</strong> {values.name}
                            </p>
                            <p>
                              <strong>SKU:</strong> {values.sku}
                            </p>
                            <p>
                              <strong>Descripción:</strong> {values.description}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Clasificación
                          </p>
                          <div className="mt-2 space-y-1 border-l-2 pl-4">
                            <p>
                              <strong>Categoría:</strong>{" "}
                              {
                                reference.categories.find(
                                  (c) =>
                                    c.id ===
                                    parseInt(values.category_id as any),
                                )?.name
                              }
                            </p>
                            <p>
                              <strong>Fabricante:</strong>{" "}
                              {
                                reference.manufacturers.find(
                                  (m) =>
                                    m.id ===
                                    parseInt(values.manufacturer_id as any),
                                )?.name
                              }
                            </p>
                            <p>
                              <strong>Marca:</strong>{" "}
                              {
                                reference.brands.find(
                                  (b) =>
                                    b.id === parseInt(values.brand_id as any),
                                )?.name
                              }
                            </p>
                            {values.model_id && (
                              <p>
                                <strong>Modelo:</strong>{" "}
                                {
                                  reference.models.find(
                                    (m) =>
                                      m.id === parseInt(values.model_id as any),
                                  )?.name
                                }
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Precios e Inventario
                          </p>
                          <div className="mt-2 space-y-1 border-l-2 pl-4">
                            <p>
                              <strong>Precio:</strong> ${values.price}
                            </p>
                            <p>
                              <strong>Stock:</strong>{" "}
                              {values.stock_quantity || 0} unidades
                            </p>
                            {values.min_stock_level && (
                              <p>
                                <strong>Nivel Mínimo:</strong>{" "}
                                {values.min_stock_level} unidades
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Estado
                          </p>
                          <div className="mt-2 space-y-2 border-l-2 pl-4">
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="is_active"
                                className="flex items-center gap-2 cursor-pointer"
                              >
                                <Field name="is_active">
                                  {({ field }: any) => (
                                    <input
                                      {...field}
                                      id="is_active"
                                      type="checkbox"
                                      checked={field.value}
                                      className="w-4 h-4 cursor-pointer"
                                    />
                                  )}
                                </Field>
                                <span>
                                  <strong>Producto Activo:</strong>{" "}
                                  {values.is_active ? "Sí" : "No"}
                                </span>
                              </Label>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {values.is_active
                                ? "El producto será visible en el catálogo"
                                : "El producto estará oculto y no se mostrará en el catálogo"}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Imágenes
                          </p>
                          <div className="mt-2 space-y-2 border-l-2 pl-4">
                            {mainImageFile || mainImage ? (
                              <div>
                                <p className="text-sm mb-1">
                                  <strong>Imagen Principal:</strong>
                                </p>
                                <img
                                  src={
                                    mainImageFile
                                      ? URL.createObjectURL(mainImageFile)
                                      : `https://disruptinglabs.com${mainImage}`
                                  }
                                  alt="Imagen principal"
                                  className="w-32 h-32 object-cover rounded border"
                                />
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Sin imagen principal
                              </p>
                            )}
                            {(extraImageFiles.length > 0 ||
                              extraImages.length > 0) && (
                              <div>
                                <p className="text-sm mb-1">
                                  <strong>Imágenes Adicionales:</strong>{" "}
                                  {extraImageFiles.length + extraImages.length}
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {extraImageFiles.map((file, idx) => (
                                    <img
                                      key={`file-${idx}`}
                                      src={URL.createObjectURL(file)}
                                      alt={`Imagen ${idx + 1}`}
                                      className="w-20 h-20 object-cover rounded border"
                                    />
                                  ))}
                                  {extraImages.map((img, idx) => (
                                    <img
                                      key={`path-${idx}`}
                                      src={`https://disruptinglabs.com${img}`}
                                      alt={`Imagen ${extraImageFiles.length + idx + 1}`}
                                      className="w-20 h-20 object-cover rounded border"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 mt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrev}
                    disabled={step === 1 || isSubmitting}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleClose}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>

                    {step < 5 ? (
                      <Button type="button" onClick={handleNext}>
                        Siguiente
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting
                          ? isEditMode
                            ? "Actualizando..."
                            : "Creando..."
                          : isEditMode
                            ? "Actualizar Producto"
                            : "Crear Producto"}
                      </Button>
                    )}
                  </div>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
