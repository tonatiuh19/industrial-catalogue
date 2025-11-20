import { Request, Response } from "express";
import { query } from "../lib/db";
import { Brand, BrandListResponse } from "../../shared/api";

export async function getBrands(req: Request, res: Response) {
  try {
    const { manufacturer_id } = req.query;

    let brands: Brand[];

    if (manufacturer_id) {
      brands = await query<Brand[]>(
        `SELECT 
           b.*,
           m.name as manufacturer_name
         FROM brands b
         LEFT JOIN manufacturers m ON b.manufacturer_id = m.id
         WHERE b.manufacturer_id = ?
         ORDER BY b.name ASC`,
        [manufacturer_id],
      );
    } else {
      brands = await query<Brand[]>(
        `SELECT 
           b.*,
           m.name as manufacturer_name
         FROM brands b
         LEFT JOIN manufacturers m ON b.manufacturer_id = m.id
         ORDER BY b.name ASC`,
      );
    }

    const response: BrandListResponse = {
      success: true,
      data: brands,
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error("Get brands error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
