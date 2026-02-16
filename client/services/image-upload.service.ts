/**
 * Image Upload Service
 * Handles communication with the PHP image upload API
 * API URL: https://disruptinglabs.com/data/api/uploadImages.php
 */

const API_URL = "https://disruptinglabs.com/data/api/uploadImages.php";
const MAIN_FOLDER = "industrial_catalogue";
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export interface ImageUploadResult {
  success: boolean;
  main_image?: {
    filename: string;
    path: string;
    original_name?: string;
  } | null;
  extra_images?: Array<{
    filename: string;
    path: string;
    original_name?: string;
  }>;
  total_uploaded?: number;
  errors?: Array<{
    type: string;
    file?: string;
    error: string;
  }>;
  error?: string;
}

export interface ImageListResult {
  success: boolean;
  main_image: {
    filename: string;
    path: string;
  } | null;
  extra_images: Array<{
    filename: string;
    path: string;
  }>;
  error?: string;
}

/**
 * Validate image file
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `El archivo ${file.name} excede el tamaño máximo de 2MB`,
    };
  }

  // Check file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: `El archivo ${file.name} no es un formato válido (solo PNG/JPG)`,
    };
  }

  return { valid: true };
}

/**
 * Upload images (main and/or extra images)
 * @param productId - Product ID or 'temp' for new products
 * @param mainImage - Optional main image file
 * @param extraImages - Optional array of extra image files
 */
export async function uploadImages(
  productId: string | number,
  mainImage?: File,
  extraImages?: File[],
): Promise<ImageUploadResult> {
  try {
    // Validate all images
    if (mainImage) {
      const validation = validateImage(mainImage);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
    }

    if (extraImages) {
      for (const file of extraImages) {
        const validation = validateImage(file);
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }
      }
    }

    const formData = new FormData();
    formData.append("main_folder", MAIN_FOLDER);
    formData.append("id", String(productId));

    if (mainImage) {
      formData.append("main_image", mainImage);
    }

    if (extraImages && extraImages.length > 0) {
      extraImages.forEach((file) => {
        formData.append("images[]", file);
      });
    }

    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ImageUploadResult = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al subir las imágenes",
    };
  }
}

/**
 * Delete an image
 * @param productId - Product ID
 * @param filename - Name of the file to delete
 * @param imageType - 'main' or 'extra'
 */
export async function deleteImage(
  productId: string | number,
  filename: string,
  imageType: "main" | "extra",
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await fetch(API_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        main_folder: MAIN_FOLDER,
        id: String(productId),
        filename,
        image_type: imageType,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al eliminar la imagen",
    };
  }
}

/**
 * Update/Replace an image
 * @param productId - Product ID
 * @param oldFilename - Name of the file to replace
 * @param newImage - New image file
 * @param imageType - 'main' or 'extra'
 */
export async function updateImage(
  productId: string | number,
  oldFilename: string,
  newImage: File,
  imageType: "main" | "extra",
): Promise<ImageUploadResult> {
  try {
    // Validate new image
    const validation = validateImage(newImage);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("main_folder", MAIN_FOLDER);
    formData.append("id", String(productId));
    formData.append("old_filename", oldFilename);
    formData.append("image", newImage);
    formData.append("image_type", imageType);

    const response = await fetch(API_URL, {
      method: "POST", // Using POST with _method=PUT
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ImageUploadResult = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Error al actualizar la imagen",
    };
  }
}

/**
 * List all images for a product
 * @param productId - Product ID
 */
export async function listImages(
  productId: string | number,
): Promise<ImageListResult> {
  try {
    const url = `${API_URL}?main_folder=${MAIN_FOLDER}&id=${productId}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: ImageListResult = await response.json();
    return result;
  } catch (error: any) {
    return {
      success: false,
      main_image: null,
      extra_images: [],
      error: error.message || "Error al listar las imágenes",
    };
  }
}

/**
 * Generate a temporary ID for new products before they're saved
 */
export function generateTempId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get full image URL from path
 */
export function getImageUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }

  // Remove leading slash from path to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  return `https://disruptinglabs.com/data/api/${cleanPath}`;
}

// ==================== REFERENCE DATA IMAGE UPLOADS ====================

/**
 * Upload images for categories
 * Uses prefixed ID: cat_{id} (compatible with existing PHP API)
 */
export async function uploadCategoryImages(
  categoryId: string | number,
  mainImage?: File,
  extraImages?: File[],
): Promise<ImageUploadResult> {
  return uploadImages(`cat_${categoryId}`, mainImage, extraImages);
}

/**
 * Upload images for subcategories
 * Uses prefixed ID: sub_{id} (compatible with existing PHP API)
 */
export async function uploadSubcategoryImages(
  subcategoryId: string | number,
  mainImage?: File,
  extraImages?: File[],
): Promise<ImageUploadResult> {
  return uploadImages(`sub_${subcategoryId}`, mainImage, extraImages);
}

/**
 * Upload images for manufacturers
 * Uses prefixed ID: mfg_{id} (compatible with existing PHP API)
 */
export async function uploadManufacturerImages(
  manufacturerId: string | number,
  mainImage?: File,
  extraImages?: File[],
): Promise<ImageUploadResult> {
  return uploadImages(`mfg_${manufacturerId}`, mainImage, extraImages);
}

/**
 * Upload images for brands
 * Uses prefixed ID: brand_{id} (compatible with existing PHP API)
 */
export async function uploadBrandImages(
  brandId: string | number,
  mainImage?: File,
  extraImages?: File[],
): Promise<ImageUploadResult> {
  return uploadImages(`brand_${brandId}`, mainImage, extraImages);
}

/**
 * Get entity prefix for a given entity type
 */
function getEntityPrefix(
  entityType: "categories" | "subcategories" | "manufacturers" | "brands",
): string {
  const prefixMap = {
    categories: "cat",
    subcategories: "sub",
    manufacturers: "mfg",
    brands: "brand",
  };
  return prefixMap[entityType];
}

/**
 * Delete image for reference data entities
 * Uses prefixed ID (compatible with existing PHP API)
 */
export async function deleteReferenceDataImage(
  entityType: "categories" | "subcategories" | "manufacturers" | "brands",
  entityId: string | number,
  filename: string,
  imageType: "main" | "extra" = "main",
): Promise<{ success: boolean; error?: string; message?: string }> {
  const prefix = getEntityPrefix(entityType);
  return deleteImage(`${prefix}_${entityId}`, filename, imageType);
}

/**
 * Update/replace image for reference data entities
 * Uses prefixed ID (compatible with existing PHP API)
 */
export async function updateReferenceDataImage(
  entityType: "categories" | "subcategories" | "manufacturers" | "brands",
  entityId: string | number,
  oldFilename: string,
  newImage: File,
  imageType: "main" | "extra" = "main",
): Promise<ImageUploadResult> {
  const prefix = getEntityPrefix(entityType);
  return updateImage(`${prefix}_${entityId}`, oldFilename, newImage, imageType);
}

/**
 * List images for reference data entities
 * Uses prefixed ID (compatible with existing PHP API)
 */
export async function listReferenceDataImages(
  entityType: "categories" | "subcategories" | "manufacturers" | "brands",
  entityId: string | number,
): Promise<ImageListResult> {
  const prefix = getEntityPrefix(entityType);
  return listImages(`${prefix}_${entityId}`);
}
