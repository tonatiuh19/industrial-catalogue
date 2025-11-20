import { Request, Response } from "express";
import { query } from "../lib/db";
import { Manufacturer, ManufacturerListResponse } from "../../shared/api";

export async function getManufacturers(_req: Request, res: Response) {
  try {
    const manufacturers = await query<Manufacturer[]>(
      `SELECT * FROM manufacturers ORDER BY name ASC`,
    );

    const response: ManufacturerListResponse = {
      success: true,
      data: manufacturers,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get manufacturers error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
