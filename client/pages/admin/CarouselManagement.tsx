import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  GripVertical,
  Image,
  ChevronUp,
  ChevronDown,
  Upload,
} from "lucide-react";
import {
  uploadImages,
  validateImage,
  getImageUrl,
} from "../../services/image-upload.service";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string | null;
  description: string | null;
  background_image: string;
  cta_text: string;
  cta_link: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

const emptySlide = (): Omit<
  CarouselSlide,
  "id" | "created_at" | "updated_at"
> => ({
  title: "",
  subtitle: "",
  description: "",
  background_image: "",
  cta_text: "Ver Catálogo",
  cta_link: "/catalog",
  sort_order: 0,
  is_active: true,
});

export default function CarouselManagement() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [formData, setFormData] = useState(emptySlide());
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [previewSlide, setPreviewSlide] = useState<CarouselSlide | null>(null);
  const [bgImageFile, setBgImageFile] = useState<File | null>(null);
  const [bgImagePreview, setBgImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/hero-carousel");
      const json = await res.json();
      if (json.success && json.data) {
        setSlides(json.data as CarouselSlide[]);
      }
    } catch (e) {
      setError("Error al cargar las diapositivas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  const openCreate = () => {
    setEditingSlide(null);
    setFormData({ ...emptySlide(), sort_order: slides.length + 1 });
    setBgImageFile(null);
    setBgImagePreview("");
    setDialogOpen(true);
  };

  const openEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle ?? "",
      description: slide.description ?? "",
      background_image: slide.background_image,
      cta_text: slide.cta_text,
      cta_link: slide.cta_link,
      sort_order: slide.sort_order,
      is_active: slide.is_active,
    });
    setBgImageFile(null);
    setBgImagePreview(
      slide.background_image ? getImageUrl(slide.background_image) : "",
    );
    setDialogOpen(true);
  };

  const handleBgImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImage(file);
    if (!validation.valid) {
      setError(validation.error ?? "Imagen inválida");
      return;
    }
    setBgImageFile(file);
    setBgImagePreview(URL.createObjectURL(file));
    setFormData((prev) => ({ ...prev, background_image: file.name }));
  };

  const handleSave = async () => {
    if (
      !formData.title.trim() ||
      (!bgImageFile && !formData.background_image.trim())
    ) {
      setError("El título y la imagen de fondo son obligatorios");
      return;
    }
    try {
      setSaving(true);
      setError(null);

      let finalImagePath = formData.background_image;
      if (bgImageFile) {
        const uploadId = editingSlide
          ? `carousel_${editingSlide.id}`
          : `carousel_${Date.now()}`;
        const uploadResult = await uploadImages(uploadId, bgImageFile);
        if (!uploadResult.success || !uploadResult.main_image?.path) {
          setError(uploadResult.error ?? "Error al subir la imagen");
          setSaving(false);
          return;
        }
        finalImagePath = uploadResult.main_image.path;
      }

      const payload = {
        ...formData,
        background_image: finalImagePath,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
      };
      if (editingSlide) {
        await fetch(`/api/admin/hero-carousel/${editingSlide.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showSuccess("Diapositiva actualizada correctamente");
      } else {
        await fetch("/api/admin/hero-carousel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showSuccess("Diapositiva creada correctamente");
      }
      setDialogOpen(false);
      await fetchSlides();
    } catch (e) {
      setError("Error al guardar la diapositiva");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/hero-carousel/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      showSuccess("Diapositiva eliminada");
      await fetchSlides();
    } catch (e) {
      setError("Error al eliminar la diapositiva");
    }
  };

  const handleToggleActive = async (slide: CarouselSlide) => {
    try {
      await fetch(`/api/admin/hero-carousel/${slide.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...slide, is_active: !slide.is_active }),
      });
      await fetchSlides();
    } catch (e) {
      setError("Error al actualizar el estado");
    }
  };

  const moveSlide = async (index: number, direction: "up" | "down") => {
    const newSlides = [...slides];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;
    [newSlides[index], newSlides[targetIndex]] = [
      newSlides[targetIndex],
      newSlides[index],
    ];
    const order = newSlides.map((s, i) => ({ id: s.id, sort_order: i + 1 }));
    setSlides(newSlides.map((s, i) => ({ ...s, sort_order: i + 1 })));
    try {
      await fetch("/api/admin/hero-carousel/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order }),
      });
    } catch (e) {
      setError("Error al reordenar");
      await fetchSlides();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Carrusel</h1>
          <p className="text-slate-500 mt-1">
            Gestiona las diapositivas del carrusel principal de la página de
            inicio
          </p>
        </div>
        <Button onClick={openCreate} className="flex items-center gap-2">
          <Plus size={16} />
          Nueva Diapositiva
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert className="border-green-500 bg-green-50 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : slides.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Image className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 mb-4">
              No hay diapositivas. Crea la primera.
            </p>
            <Button onClick={openCreate}>
              <Plus size={16} className="mr-2" /> Nueva Diapositiva
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {slides.map((slide, index) => (
            <Card
              key={slide.id}
              className={`overflow-hidden transition-all ${!slide.is_active ? "opacity-60" : ""}`}
            >
              <CardContent className="p-0">
                <div className="flex items-stretch">
                  {/* Thumbnail */}
                  <div className="relative w-40 h-28 flex-shrink-0 bg-slate-100">
                    <img
                      src={getImageUrl(slide.background_image)}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                      }}
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white text-xs font-bold bg-black/50 rounded px-2 py-1">
                        #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-4 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 truncate">
                          {slide.title}
                        </h3>
                        {slide.subtitle && (
                          <span className="text-slate-500 text-sm truncate hidden sm:block">
                            — {slide.subtitle}
                          </span>
                        )}
                        <Badge
                          variant={slide.is_active ? "default" : "secondary"}
                          className="flex-shrink-0"
                        >
                          {slide.is_active ? "Activa" : "Inactiva"}
                        </Badge>
                      </div>
                      {slide.description && (
                        <p className="text-sm text-slate-500 line-clamp-1">
                          {slide.description}
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-1">
                        CTA:{" "}
                        <span className="font-medium text-slate-600">
                          {slide.cta_text}
                        </span>
                        {" · "}Link:{" "}
                        <span className="font-medium text-slate-600">
                          {slide.cta_link}
                        </span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Reorder */}
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={index === 0}
                          onClick={() => moveSlide(index, "up")}
                        >
                          <ChevronUp size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          disabled={index === slides.length - 1}
                          onClick={() => moveSlide(index, "down")}
                        >
                          <ChevronDown size={14} />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setPreviewSlide(slide)}
                        title="Vista previa"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(slide)}
                        title={slide.is_active ? "Desactivar" : "Activar"}
                      >
                        {slide.is_active ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(slide)}
                        title="Editar"
                      >
                        <Edit3 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteConfirmId(slide.id)}
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? "Editar Diapositiva" : "Nueva Diapositiva"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Título <span className="text-red-500">*</span>
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ej. Potencia Industrial"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Subtítulo
                </label>
                <Input
                  value={formData.subtitle ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="Ej. Sin Límites"
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Descripción
                </label>
                <Textarea
                  value={formData.description ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Descripción breve que aparece en el carrusel"
                  rows={3}
                />
              </div>

              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Imagen de fondo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleBgImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={16} />
                  {bgImageFile ? bgImageFile.name : "Seleccionar imagen"}
                </Button>
                {bgImagePreview && (
                  <div className="mt-2 relative h-32 rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={bgImagePreview}
                      alt="preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Orden
                </label>
                <Input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sort_order: parseInt(e.target.value) || 0,
                    })
                  }
                  min={1}
                />
              </div>

              <div className="flex items-center gap-3 pt-5">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                  className="w-4 h-4 accent-primary"
                />
                <label
                  htmlFor="is_active"
                  className="text-sm font-medium text-slate-700 cursor-pointer"
                >
                  Diapositiva activa
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save size={16} />
                {saving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={() => setDeleteConfirmId(null)}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Eliminar Diapositiva</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600 text-sm">
            ¿Estás seguro de que deseas eliminar esta diapositiva? Esta acción
            no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteConfirmId !== null && handleDelete(deleteConfirmId)
              }
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={previewSlide !== null}
        onOpenChange={() => setPreviewSlide(null)}
      >
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Vista previa</DialogTitle>
          </DialogHeader>
          {previewSlide && (
            <div className="relative h-72 sm:h-96">
              <img
                src={getImageUrl(previewSlide.background_image)}
                alt={previewSlide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
              <div className="absolute inset-0 flex items-center p-8">
                <div>
                  <h2 className="text-3xl font-black text-white leading-tight">
                    {previewSlide.title}
                  </h2>
                  {previewSlide.subtitle && (
                    <h3 className="text-3xl font-black text-orange-400 leading-tight">
                      {previewSlide.subtitle}
                    </h3>
                  )}
                  {previewSlide.description && (
                    <p className="text-gray-200 mt-3 max-w-md text-sm">
                      {previewSlide.description}
                    </p>
                  )}
                  <div className="mt-4">
                    <span className="inline-block bg-[#c03818] text-white text-sm font-bold rounded-xl px-6 py-2">
                      {previewSlide.cta_text}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
