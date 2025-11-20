import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getProducts, getProductById } from "./routes/products";
import { getCategories } from "./routes/categories";
import { getManufacturers } from "./routes/manufacturers";
import { getBrands } from "./routes/brands";
import { getModels } from "./routes/models";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Product routes
  app.get("/api/products", getProducts);
  app.get("/api/products/:id", getProductById);

  // Filter option routes
  app.get("/api/categories", getCategories);
  app.get("/api/manufacturers", getManufacturers);
  app.get("/api/brands", getBrands);
  app.get("/api/models", getModels);

  return app;
}
