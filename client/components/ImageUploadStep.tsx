import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateImage, getImageUrl } from "@/services/image-upload.service";

interface ImageUploadStepProps {
  productId: string | number;
  mainImage: string | null;
  extraImages: string[];
  mainImageFile: File | null;
  extraImageFiles: File[];
  onMainImageChange: (path: string | null) => void;
  onExtraImagesChange: (paths: string[]) => void;
  onMainImageFileChange: (file: File | null) => void;
  onExtraImageFilesChange: (files: File[]) => void;
}

export function ImageUploadStep({
  productId,
  mainImage,
  extraImages,
  mainImageFile,
  extraImageFiles,
  onMainImageChange,
  onExtraImagesChange,
  onMainImageFileChange,
  onExtraImageFilesChange,
}: ImageUploadStepProps) {
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState<"main" | "extra" | null>(null);

  const handleMainImageUpload = useCallback(
    (file: File) => {
      const validation = validateImage(file);
      if (!validation.valid) {
        toast({
          title: "Error",
          description: validation.error,
          variant: "destructive",
        });
        return;
      }

      onMainImageFileChange(file);
      toast({
        title: "Listo",
        description: "Imagen principal seleccionada (se subirá al guardar)",
      });
    },
    [onMainImageFileChange, toast],
  );

  const handleExtraImagesUpload = useCallback(
    (files: File[]) => {
      // Validate all files
      for (const file of files) {
        const validation = validateImage(file);
        if (!validation.valid) {
          toast({
            title: "Error",
            description: validation.error,
            variant: "destructive",
          });
          return;
        }
      }

      onExtraImageFilesChange([...extraImageFiles, ...files]);
      toast({
        title: "Listo",
        description: `${files.length} imagen(es) seleccionada(s) (se subirán al guardar)`,
      });
    },
    [extraImageFiles, onExtraImageFilesChange, toast],
  );

  const handleDeleteMainImage = useCallback(() => {
    onMainImageFileChange(null);
    onMainImageChange(null);
  }, [onMainImageFileChange, onMainImageChange]);

  const handleDeleteExtraImage = useCallback(
    (index: number) => {
      const newFiles = extraImageFiles.filter((_, i) => i !== index);
      const newPaths = extraImages.filter((_, i) => i !== index);
      onExtraImageFilesChange(newFiles);
      onExtraImagesChange(newPaths);
    },
    [
      extraImageFiles,
      extraImages,
      onExtraImageFilesChange,
      onExtraImagesChange,
    ],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, type: "main" | "extra") => {
      e.preventDefault();
      setDragOver(null);

      const files = Array.from(e.dataTransfer.files);
      if (type === "main" && files.length > 0) {
        handleMainImageUpload(files[0]);
      } else if (type === "extra" && files.length > 0) {
        handleExtraImagesUpload(files);
      }
    },
    [handleMainImageUpload, handleExtraImagesUpload],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: "main" | "extra") => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      if (type === "main") {
        handleMainImageUpload(files[0]);
      } else {
        handleExtraImagesUpload(Array.from(files));
      }

      // Reset input
      e.target.value = "";
    },
    [handleMainImageUpload, handleExtraImagesUpload],
  );

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Imagen Principal
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Imagen principal del producto (máximo 2MB, PNG/JPG)
          </p>
        </CardHeader>
        <CardContent>
          {mainImageFile || mainImage ? (
            <div className="relative">
              <img
                src={
                  mainImageFile
                    ? URL.createObjectURL(mainImageFile)
                    : getImageUrl(mainImage!)
                }
                alt="Imagen principal"
                className="w-full h-64 object-contain rounded-lg border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleDeleteMainImage}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragOver === "main"
                  ? "border-primary bg-primary/5"
                  : "border-gray-300"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver("main");
              }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, "main")}
            >
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <input
                type="file"
                id="main-image-input"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={(e) => handleFileSelect(e, "main")}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  document.getElementById("main-image-input")?.click()
                }
              >
                Seleccionar Imagen
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Extra Images */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Imágenes Adicionales
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Imágenes extras del producto (máximo 2MB cada una, PNG/JPG)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragOver === "extra"
                ? "border-primary bg-primary/5"
                : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver("extra");
            }}
            onDragLeave={() => setDragOver(null)}
            onDrop={(e) => handleDrop(e, "extra")}
          >
            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Arrastra imágenes aquí o haz clic para seleccionar
            </p>
            <input
              type="file"
              id="extra-images-input"
              className="hidden"
              accept="image/png,image/jpeg,image/jpg"
              multiple
              onChange={(e) => handleFileSelect(e, "extra")}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                document.getElementById("extra-images-input")?.click()
              }
            >
              Seleccionar Imágenes
            </Button>
          </div>

          {/* Extra Images Grid */}
          {(extraImageFiles.length > 0 || extraImages.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {extraImageFiles.map((file, index) => (
                <div key={`file-${index}`} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Imagen adicional ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteExtraImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {extraImageFiles.length === 0 && extraImages.length === 0 && (
            <p className="text-sm text-center text-muted-foreground">
              No hay imágenes adicionales
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
