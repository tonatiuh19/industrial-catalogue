import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getProducts, getProductById } from "./routes/products";
import { getCategories } from "./routes/categories";
import { getManufacturers } from "./routes/manufacturers";
import { getBrands } from "./routes/brands";
import { getModels } from "./routes/models";
import { checkUser, sendCode, verifyCode } from "./routes/admin/auth";
import {
  getAdminProducts,
  getAdminProduct,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "./routes/admin/products";
import {
  getAdminQuotes,
  getAdminQuote,
  updateAdminQuote,
} from "./routes/admin/quotes";
import {
  getAdminUsers,
  getAdminUser,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "./routes/admin/users";
import {
  getContentPages,
  getContentPage,
  updateContentPage,
} from "./routes/admin/content";

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

  // Admin Auth routes (proxies to /api folder for development)
  app.post("/api/admin/auth/check-user", checkUser);
  app.post("/api/admin/auth/send-code", sendCode);
  app.post("/api/admin/auth/verify-code", verifyCode);

  // Admin Products routes (proxies to /api folder for development)
  app.get("/api/admin/products", getAdminProducts);
  app.post("/api/admin/products", createAdminProduct);
  app.get("/api/admin/products/:id", getAdminProduct);
  app.put("/api/admin/products/:id", updateAdminProduct);
  app.delete("/api/admin/products/:id", deleteAdminProduct);

  // Admin Quotes routes (proxies to /api folder for development)
  app.get("/api/admin/quotes", getAdminQuotes);
  app.get("/api/admin/quotes/:id", getAdminQuote);
  app.put("/api/admin/quotes/:id", updateAdminQuote);

  // Admin Users routes (proxies to /api folder for development)
  app.get("/api/admin/users", getAdminUsers);
  app.post("/api/admin/users", createAdminUser);
  app.get("/api/admin/users/:id", getAdminUser);
  app.put("/api/admin/users/:id", updateAdminUser);
  app.delete("/api/admin/users/:id", deleteAdminUser);

  // Admin Content routes (proxies to /api folder for development)
  app.get("/api/admin/content", getContentPages);
  app.get("/api/admin/content/:slug", getContentPage);
  app.put("/api/admin/content/:slug", updateContentPage);

  return app;
}
