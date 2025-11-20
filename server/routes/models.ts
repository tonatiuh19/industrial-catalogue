import { Request, Response } from "express";
import { query } from "../lib/db";
import { Model, ModelListResponse } from "../../shared/api";

export async function getModels(req: Request, res: Response) {
  try {
    const { brand_id } = req.query;

    let models: Model[];

    if (brand_id) {
      models = await query<Model[]>(
        `SELECT 
           mo.*,
           b.name as brand_name
         FROM models mo
         LEFT JOIN brands b ON mo.brand_id = b.id
         WHERE mo.brand_id = ?
         ORDER BY mo.name ASC`,
        [brand_id],
      );
    } else {
      models = await query<Model[]>(
        `SELECT 
           mo.*,
           b.name as brand_name
         FROM models mo
         LEFT JOIN brands b ON mo.brand_id = b.id
         ORDER BY mo.name ASC`,
      );
    }

    const response: ModelListResponse = {
      success: true,
      data: models,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get models error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
