import React, { useState, useEffect } from "react";
import { useAdminStore } from "@/store/AdminStoreContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus,
  Search,
  Edit,
  Trash2,
  Loader2,
  Package,
  Tag,
  Factory,
  Layers,
  Power,
  PowerOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductWizard from "@/components/ProductWizard";
import ReferenceDataWizard from "@/components/ReferenceDataWizard";
import ModelDialog from "@/components/ModelDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  categoriesApi,
  manufacturersApi,
  brandsApi,
  modelsApi,
  subcategoriesApi,
} from "@/services/api.service";
import { getImageUrl } from "@/services/image-upload.service";

export default function Products() {
  const {
    state,
    fetchAdminProducts,
    deleteAdminProduct,
    updateAdminProduct,
    fetchAllReferenceData,
  } = useAdminStore();
  const { products: productsState, reference } = state;
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("categories");
  const [showWizard, setShowWizard] = useState(false);
  const [showReferenceDialog, setShowReferenceDialog] = useState(false);
  const [referenceDialogType, setReferenceDialogType] = useState<
    "category" | "manufacturer" | "brand" | "subcategory"
  >("category");
  const [showModelDialog, setShowModelDialog] = useState(false);
  const [editingReference, setEditingReference] = useState<any>(null);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "default" | "destructive";
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
    variant: "default",
  });

  useEffect(() => {
    loadProducts();
    fetchAllReferenceData();
  }, []);

  const loadProducts = async () => {
    try {
      await fetchAdminProducts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cargar los productos",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Eliminar Producto",
      description:
        "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteAdminProduct(id);
          toast({
            title: "Éxito",
            description: "Producto eliminado exitosamente",
          });
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description: error.message || "Error al eliminar el producto",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleDeleteCategory = async (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Eliminar Categoría",
      description:
        "¿Estás seguro de que deseas eliminar esta categoría? Esta acción no se puede deshacer.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await categoriesApi.delete(id);
          toast({
            title: "Éxito",
            description: "Categoría eliminada exitosamente",
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Error al eliminar la categoría",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleDeleteSubcategory = async (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Eliminar Subcategoría",
      description:
        "¿Estás seguro de que deseas eliminar esta subcategoría? Esta acción no se puede deshacer.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await subcategoriesApi.delete(id);
          toast({
            title: "Éxito",
            description: "Subcategoría eliminada exitosamente",
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Error al eliminar la subcategoría",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleDeleteManufacturer = async (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Eliminar Fabricante",
      description:
        "¿Estás seguro de que deseas eliminar este fabricante? Esta acción no se puede deshacer.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await manufacturersApi.delete(id);
          toast({
            title: "Éxito",
            description: "Fabricante eliminado exitosamente",
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Error al eliminar el fabricante",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleDeleteBrand = async (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Eliminar Marca",
      description:
        "¿Estás seguro de que deseas eliminar esta marca? Esta acción no se puede deshacer.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await brandsApi.delete(id);
          toast({
            title: "Éxito",
            description: "Marca eliminada exitosamente",
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Error al eliminar la marca",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleDeleteModel = async (id: number) => {
    setConfirmDialog({
      open: true,
      title: "Eliminar Modelo",
      description:
        "¿Estás seguro de que deseas eliminar este modelo? Esta acción no se puede deshacer.",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await modelsApi.delete(id);
          toast({
            title: "Éxito",
            description: "Modelo eliminado exitosamente",
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.response?.data?.message ||
              error.message ||
              "Error al eliminar el modelo",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleEditCategory = (category: any) => {
    setEditingReference(category);
    setReferenceDialogType("category");
    setShowReferenceDialog(true);
  };

  const handleEditSubcategory = (subcategory: any) => {
    setEditingReference(subcategory);
    setReferenceDialogType("subcategory");
    setShowReferenceDialog(true);
  };

  const handleEditManufacturer = (manufacturer: any) => {
    setEditingReference(manufacturer);
    setReferenceDialogType("manufacturer");
    setShowReferenceDialog(true);
  };

  const handleEditBrand = (brand: any) => {
    setEditingReference(brand);
    setReferenceDialogType("brand");
    setShowReferenceDialog(true);
  };

  const handleEditModel = (model: any) => {
    setEditingModel(model);
    setShowModelDialog(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowWizard(true);
  };

  const handleToggleProductStatus = async (
    id: number,
    currentStatus: boolean,
  ) => {
    const newStatus = !currentStatus;
    setConfirmDialog({
      open: true,
      title: newStatus ? "Activar Producto" : "Desactivar Producto",
      description: `¿Estás seguro de que deseas ${newStatus ? "activar" : "desactivar"} este producto?`,
      variant: "default",
      onConfirm: async () => {
        try {
          await updateAdminProduct(id, { is_active: newStatus });
          toast({
            title: "Éxito",
            description: `Producto ${newStatus ? "activado" : "desactivado"} exitosamente`,
          });
          loadProducts();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.message || "Error al actualizar el estado del producto",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleToggleCategoryStatus = async (
    id: number,
    currentStatus: boolean,
  ) => {
    const newStatus = !currentStatus;
    setConfirmDialog({
      open: true,
      title: newStatus ? "Activar Categoría" : "Desactivar Categoría",
      description: `¿Estás seguro de que deseas ${newStatus ? "activar" : "desactivar"} esta categoría?`,
      variant: "default",
      onConfirm: async () => {
        try {
          await categoriesApi.update(id, {
            name: "",
            slug: "",
            is_active: newStatus,
          });
          toast({
            title: "Éxito",
            description: `Categoría ${newStatus ? "activada" : "desactivada"} exitosamente`,
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.message || "Error al actualizar el estado de la categoría",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleToggleSubcategoryStatus = async (
    id: number,
    currentStatus: boolean,
  ) => {
    const newStatus = !currentStatus;
    setConfirmDialog({
      open: true,
      title: newStatus ? "Activar Subcategoría" : "Desactivar Subcategoría",
      description: `¿Estás seguro de que deseas ${newStatus ? "activar" : "desactivar"} esta subcategoría?`,
      variant: "default",
      onConfirm: async () => {
        try {
          await subcategoriesApi.update(id, {
            name: "",
            category_id: 0,
            is_active: newStatus,
          });
          toast({
            title: "Éxito",
            description: `Subcategoría ${newStatus ? "activada" : "desactivada"} exitosamente`,
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.message ||
              "Error al actualizar el estado de la subcategoría",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleToggleManufacturerStatus = async (
    id: number,
    currentStatus: boolean,
  ) => {
    const newStatus = !currentStatus;
    setConfirmDialog({
      open: true,
      title: newStatus ? "Activar Fabricante" : "Desactivar Fabricante",
      description: `¿Estás seguro de que deseas ${newStatus ? "activar" : "desactivar"} este fabricante?`,
      variant: "default",
      onConfirm: async () => {
        try {
          await manufacturersApi.update(id, {
            name: "",
            is_active: newStatus,
          });
          toast({
            title: "Éxito",
            description: `Fabricante ${newStatus ? "activado" : "desactivado"} exitosamente`,
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.message || "Error al actualizar el estado del fabricante",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleToggleBrandStatus = async (
    id: number,
    currentStatus: boolean,
  ) => {
    const newStatus = !currentStatus;
    setConfirmDialog({
      open: true,
      title: newStatus ? "Activar Marca" : "Desactivar Marca",
      description: `¿Estás seguro de que deseas ${newStatus ? "activar" : "desactivar"} esta marca?`,
      variant: "default",
      onConfirm: async () => {
        try {
          await brandsApi.update(id, {
            name: "",
            manufacturer_id: 0,
            is_active: newStatus,
          });
          toast({
            title: "Éxito",
            description: `Marca ${newStatus ? "activada" : "desactivada"} exitosamente`,
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.message || "Error al actualizar el estado de la marca",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleToggleModelStatus = async (
    id: number,
    currentStatus: boolean,
  ) => {
    const newStatus = !currentStatus;
    setConfirmDialog({
      open: true,
      title: newStatus ? "Activar Modelo" : "Desactivar Modelo",
      description: `¿Estás seguro de que deseas ${newStatus ? "activar" : "desactivar"} este modelo?`,
      variant: "default",
      onConfirm: async () => {
        try {
          await modelsApi.update(id, {
            name: "",
            brand_id: 0,
            is_active: newStatus,
          });
          toast({
            title: "Éxito",
            description: `Modelo ${newStatus ? "activado" : "desactivado"} exitosamente`,
          });
          fetchAllReferenceData();
          setConfirmDialog({ ...confirmDialog, open: false });
        } catch (error: any) {
          toast({
            title: "Error",
            description:
              error.message || "Error al actualizar el estado del modelo",
            variant: "destructive",
          });
        }
      },
    });
  };

  const handleDialogClose = (type: "reference" | "model") => {
    switch (type) {
      case "reference":
        setShowReferenceDialog(false);
        setEditingReference(null);
        break;
      case "model":
        setShowModelDialog(false);
        setEditingModel(null);
        break;
    }
  };

  const filteredProducts = productsState.products.filter(
    (product) =>
      product.name?.toLowerCase().includes(search.toLowerCase()) ||
      (product.brand_name &&
        product.brand_name?.toLowerCase().includes(search.toLowerCase())) ||
      (product.category_name &&
        product.category_name?.toLowerCase().includes(search.toLowerCase())),
  );

  const filteredCategories = reference.categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredManufacturers = reference.manufacturers.filter((mfg) =>
    mfg.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredBrands = reference.brands.filter((brand) =>
    brand.name.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredModels = reference.models.filter((model) =>
    model.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Debug log
  console.log("Reference data:", {
    categories: reference.categories?.length,
    subcategories: reference.subcategories?.length,
    manufacturers: reference.manufacturers?.length,
    brands: reference.brands?.length,
    models: reference.models?.length,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catálogo</h1>
          <p className="text-slate-600">Administra tu catálogo</p>
        </div>
        {activeTab === "products" && (
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto
          </Button>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Productos (Opcional)</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            <span className="hidden sm:inline">Categorías</span>
          </TabsTrigger>
          <TabsTrigger
            value="subcategories"
            className="flex items-center gap-2"
          >
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Subcategorías</span>
          </TabsTrigger>
          <TabsTrigger
            value="manufacturers"
            className="flex items-center gap-2"
          >
            <Factory className="h-4 w-4" />
            <span className="hidden sm:inline">Fabricantes (Opcional)</span>
          </TabsTrigger>
          <TabsTrigger value="brands" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Marcas</span>
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Modelos (Opcional)</span>
          </TabsTrigger>
        </TabsList>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar productos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {productsState.loading.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-4 text-slate-600">
                    No se encontraron productos
                  </p>
                  <Button onClick={() => setShowWizard(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Agrega Tu Primer Producto
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Nombre</TableHead>
                        <TableHead className="min-w-[150px]">Marca</TableHead>
                        <TableHead className="min-w-[150px]">
                          Categoría
                        </TableHead>
                        <TableHead className="min-w-[120px]">Modelo</TableHead>
                        <TableHead className="min-w-[100px]">Estado</TableHead>
                        <TableHead className="text-right min-w-[120px]">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.brand_name || "-"}</TableCell>
                          <TableCell>{product.category_name || "-"}</TableCell>
                          <TableCell>{product.model_name || "-"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                product.is_active ? "default" : "secondary"
                              }
                            >
                              {product.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleToggleProductStatus(
                                    product.id,
                                    product.is_active,
                                  )
                                }
                                title={
                                  product.is_active ? "Desactivar" : "Activar"
                                }
                              >
                                {product.is_active ? (
                                  <PowerOff className="h-4 w-4 text-orange-600" />
                                ) : (
                                  <Power className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Categorías
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setReferenceDialogType("category");
                    setShowReferenceDialog(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Categoría
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar categorías..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </div>

              {reference.loading.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px]">Imagen</TableHead>
                        <TableHead className="min-w-[200px]">Nombre</TableHead>
                        <TableHead className="min-w-[250px]">
                          Descripción
                        </TableHead>
                        <TableHead className="min-w-[180px]">Slug</TableHead>
                        <TableHead className="min-w-[100px]">Estado</TableHead>
                        <TableHead className="text-right min-w-[140px]">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.map((category) => (
                        <TableRow key={category.id}>
                          <TableCell>
                            {category.main_image ? (
                              <img
                                src={getImageUrl(category.main_image)}
                                alt={category.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Tag className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {category.name}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {category.description || "-"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {category.slug}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                category.is_active ? "default" : "secondary"
                              }
                            >
                              {category.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleToggleCategoryStatus(
                                    category.id,
                                    category.is_active,
                                  )
                                }
                                title={
                                  category.is_active ? "Desactivar" : "Activar"
                                }
                              >
                                {category.is_active ? (
                                  <PowerOff className="h-4 w-4 text-orange-600" />
                                ) : (
                                  <Power className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteCategory(category.id)
                                }
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subcategories Tab */}
        <TabsContent value="subcategories" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Subcategorías
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setReferenceDialogType("subcategory");
                    setShowReferenceDialog(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Subcategoría
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar subcategorías..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </div>

              {reference.loading.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px]">Imagen</TableHead>
                        <TableHead className="min-w-[200px]">Nombre</TableHead>
                        <TableHead className="min-w-[150px]">
                          Categoría
                        </TableHead>
                        <TableHead className="min-w-[250px]">
                          Descripción
                        </TableHead>
                        <TableHead className="min-w-[100px]">Estado</TableHead>
                        <TableHead className="text-right min-w-[140px]">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(reference.subcategories || [])
                        .filter((sub) =>
                          sub.name.toLowerCase().includes(search.toLowerCase()),
                        )
                        .map((subcategory) => {
                          const category = reference.categories.find(
                            (c) => c.id === subcategory.category_id,
                          );
                          return (
                            <TableRow key={subcategory.id}>
                              <TableCell>
                                {subcategory.main_image ? (
                                  <img
                                    src={getImageUrl(subcategory.main_image)}
                                    alt={subcategory.name}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                    <Layers className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="font-medium">
                                {subcategory.name}
                              </TableCell>
                              <TableCell>{category?.name || "-"}</TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {subcategory.description || "-"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    subcategory.is_active
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {subcategory.is_active
                                    ? "Activo"
                                    : "Inactivo"}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleEditSubcategory(subcategory)
                                    }
                                    title="Editar"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleToggleSubcategoryStatus(
                                        subcategory.id,
                                        subcategory.is_active,
                                      )
                                    }
                                    title={
                                      subcategory.is_active
                                        ? "Desactivar"
                                        : "Activar"
                                    }
                                  >
                                    {subcategory.is_active ? (
                                      <PowerOff className="h-4 w-4 text-orange-600" />
                                    ) : (
                                      <Power className="h-4 w-4 text-green-600" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleDeleteSubcategory(subcategory.id)
                                    }
                                    title="Eliminar"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manufacturers Tab */}
        <TabsContent value="manufacturers" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Fabricantes
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setReferenceDialogType("manufacturer");
                    setShowReferenceDialog(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Fabricante
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar fabricantes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </div>

              {reference.loading.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px]">Imagen</TableHead>
                        <TableHead className="min-w-[180px]">Nombre</TableHead>
                        <TableHead className="min-w-[140px]">
                          Categoría
                        </TableHead>
                        <TableHead className="min-w-[140px]">
                          Subcategoría
                        </TableHead>
                        <TableHead className="min-w-[250px]">
                          Descripción
                        </TableHead>
                        <TableHead className="min-w-[100px]">Estado</TableHead>
                        <TableHead className="text-right min-w-[140px]">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredManufacturers.map((manufacturer) => (
                        <TableRow key={manufacturer.id}>
                          <TableCell>
                            {manufacturer.main_image ? (
                              <img
                                src={getImageUrl(manufacturer.main_image)}
                                alt={manufacturer.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                <Factory className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {manufacturer.name}
                          </TableCell>
                          <TableCell className="text-sm">
                            {manufacturer.category_name || "-"}
                          </TableCell>
                          <TableCell className="text-sm">
                            {manufacturer.subcategory_name || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {manufacturer.description || "-"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                manufacturer.is_active ? "default" : "secondary"
                              }
                            >
                              {manufacturer.is_active ? "Activo" : "Inactivo"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditManufacturer(manufacturer)
                                }
                                title="Editar"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleToggleManufacturerStatus(
                                    manufacturer.id,
                                    manufacturer.is_active,
                                  )
                                }
                                title={
                                  manufacturer.is_active
                                    ? "Desactivar"
                                    : "Activar"
                                }
                              >
                                {manufacturer.is_active ? (
                                  <PowerOff className="h-4 w-4 text-orange-600" />
                                ) : (
                                  <Power className="h-4 w-4 text-green-600" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteManufacturer(manufacturer.id)
                                }
                                title="Eliminar"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Brands Tab */}
        <TabsContent value="brands" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Marcas
                </CardTitle>
                <Button
                  size="sm"
                  onClick={() => {
                    setReferenceDialogType("brand");
                    setShowReferenceDialog(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Marca
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar marcas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </div>

              {reference.loading.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[80px]">Imagen</TableHead>
                        <TableHead className="min-w-[180px]">Nombre</TableHead>
                        <TableHead className="min-w-[150px]">
                          Fabricante
                        </TableHead>
                        <TableHead className="min-w-[130px]">
                          Categoría
                        </TableHead>
                        <TableHead className="min-w-[130px]">
                          Subcategoría
                        </TableHead>
                        <TableHead className="min-w-[230px]">
                          Descripción
                        </TableHead>
                        <TableHead className="min-w-[100px]">Estado</TableHead>
                        <TableHead className="text-right min-w-[140px]">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBrands.map((brand) => {
                        const manufacturer = reference.manufacturers.find(
                          (m) => m.id === brand.manufacturer_id,
                        );
                        return (
                          <TableRow key={brand.id}>
                            <TableCell>
                              {brand.main_image ? (
                                <img
                                  src={getImageUrl(brand.main_image)}
                                  alt={brand.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                  <Layers className="h-6 w-6 text-gray-400" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {brand.name}
                            </TableCell>
                            <TableCell>{manufacturer?.name || "-"}</TableCell>
                            <TableCell className="text-sm">
                              {brand.category_names &&
                              brand.category_names.length > 0
                                ? brand.category_names.join(", ")
                                : brand.category_name || "-"}
                            </TableCell>
                            <TableCell className="text-sm">
                              {brand.subcategory_name || "-"}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {brand.description || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  brand.is_active ? "default" : "secondary"
                                }
                              >
                                {brand.is_active ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditBrand(brand)}
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleToggleBrandStatus(
                                      brand.id,
                                      brand.is_active,
                                    )
                                  }
                                  title={
                                    brand.is_active ? "Desactivar" : "Activar"
                                  }
                                >
                                  {brand.is_active ? (
                                    <PowerOff className="h-4 w-4 text-orange-600" />
                                  ) : (
                                    <Power className="h-4 w-4 text-green-600" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteBrand(brand.id)}
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Modelos
                </CardTitle>
                <Button size="sm" onClick={() => setShowModelDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Modelo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar modelos..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
              </div>

              {reference.loading.isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[200px]">Nombre</TableHead>
                        <TableHead className="min-w-[150px]">Marca</TableHead>
                        <TableHead className="min-w-[300px]">
                          Descripción
                        </TableHead>
                        <TableHead className="min-w-[100px]">Estado</TableHead>
                        <TableHead className="text-right min-w-[140px]">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredModels.map((model) => {
                        const brand = reference.brands.find(
                          (b) => b.id === model.brand_id,
                        );
                        return (
                          <TableRow key={model.id}>
                            <TableCell className="font-medium">
                              {model.name}
                            </TableCell>
                            <TableCell>{brand?.name || "-"}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {model.description || "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  model.is_active ? "default" : "secondary"
                                }
                              >
                                {model.is_active ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditModel(model)}
                                  title="Editar"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleToggleModelStatus(
                                      model.id,
                                      model.is_active,
                                    )
                                  }
                                  title={
                                    model.is_active ? "Desactivar" : "Activar"
                                  }
                                >
                                  {model.is_active ? (
                                    <PowerOff className="h-4 w-4 text-orange-600" />
                                  ) : (
                                    <Power className="h-4 w-4 text-green-600" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteModel(model.id)}
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProductWizard
        open={showWizard}
        onClose={() => {
          setShowWizard(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          loadProducts();
          setShowWizard(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />

      <ReferenceDataWizard
        open={showReferenceDialog}
        onClose={() => handleDialogClose("reference")}
        onSuccess={() => {
          fetchAllReferenceData();
          setSearch("");
          handleDialogClose("reference");
        }}
        type={referenceDialogType}
        entity={editingReference}
      />

      <ModelDialog
        open={showModelDialog}
        onClose={() => handleDialogClose("model")}
        onSuccess={() => {
          fetchAllReferenceData();
          setSearch("");
          handleDialogClose("model");
        }}
        model={editingModel}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
      />
    </div>
  );
}
