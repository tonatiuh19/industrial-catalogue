import * as Yup from "yup";
import { categoriesApi } from "@/services/api.service";

// Category Validation Schema
export const categoryValidationSchema = Yup.object({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  slug: Yup.string()
    .required("Slug is required")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens",
    )
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug must not exceed 100 characters")
    .test("unique-slug", "This slug is already in use", async (value) => {
      if (!value) return true;
      try {
        const response = await categoriesApi.validateSlug(value);
        return response.data.available;
      } catch (error) {
        return true; // Allow on error
      }
    }),
  description: Yup.string().max(
    500,
    "Description must not exceed 500 characters",
  ),
});

// Manufacturer Validation Schema
export const manufacturerValidationSchema = Yup.object({
  name: Yup.string()
    .required("Manufacturer name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  website: Yup.string().url("Must be a valid URL").nullable(),
  description: Yup.string().max(
    500,
    "Description must not exceed 500 characters",
  ),
});

// Brand Validation Schema
export const brandValidationSchema = Yup.object({
  name: Yup.string()
    .required("Brand name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  manufacturer_id: Yup.number()
    .required("Manufacturer is required")
    .positive("Please select a manufacturer"),
  description: Yup.string().max(
    500,
    "Description must not exceed 500 characters",
  ),
});

// Model Validation Schema
export const modelValidationSchema = Yup.object({
  name: Yup.string()
    .required("Model name is required")
    .min(1, "Name must be at least 1 character")
    .max(100, "Name must not exceed 100 characters"),
  brand_id: Yup.number()
    .required("Brand is required")
    .positive("Please select a brand"),
  description: Yup.string().max(
    500,
    "Description must not exceed 500 characters",
  ),
});

// Product Validation Schema
export const productValidationSchema = Yup.object({
  name: Yup.string()
    .required("Product name is required")
    .min(2, "Name must be at least 2 characters")
    .max(255, "Name must not exceed 255 characters"),
  sku: Yup.string()
    .required("SKU is required")
    .min(2, "SKU must be at least 2 characters")
    .max(50, "SKU must not exceed 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  long_description: Yup.string().max(
    5000,
    "Long description must not exceed 5000 characters",
  ),
  category_id: Yup.number()
    .required("Category is required")
    .positive("Please select a category"),
  manufacturer_id: Yup.number()
    .required("Manufacturer is required")
    .positive("Please select a manufacturer"),
  brand_id: Yup.number()
    .required("Brand is required")
    .positive("Please select a brand"),
  model_id: Yup.number().nullable().positive("Please select a valid model"),
  price: Yup.number()
    .required("Price is required")
    .min(0, "Price must be at least 0")
    .max(999999.99, "Price must not exceed 999,999.99"),
  stock_quantity: Yup.number()
    .min(0, "Stock quantity must be at least 0")
    .max(999999, "Stock quantity must not exceed 999,999")
    .integer("Stock quantity must be a whole number"),
  min_stock_level: Yup.number()
    .min(0, "Minimum stock level must be at least 0")
    .max(999999, "Minimum stock level must not exceed 999,999")
    .integer("Minimum stock level must be a whole number"),
});
