import { Request, Response } from "express";

import pool from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import { getEffectSchema } from "./schema";

export const getEffects = async (req: Request, res: Response) => {
  try {
    const effects = await pool.query("SELECT * FROM effects");
    // 3.returnare succes
    res.status(200).json(effects.rows);
  } catch (error: any) {
    // 4.1 returnare eroare api
    console.error("❌ Error:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    // 4.2 Returnare orice alta eroare
    res.status(500).send(error.message);
  }
};
export const getEffect = async (req: Request, res: Response) => {
  try {
    //validate
    const parsedHeaders = getEffectSchema.safeParse(req.query);
    if (!parsedHeaders.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: parsedHeaders.error.errors,
      });
      return;
    }
    //

    const effects = await pool.query("SELECT * FROM effects WHERE name = $1", [
      parsedHeaders.data?.name,
    ]);
    // 3.returnare succes
    res.status(200).json(effects.rows[0]);
  } catch (error: any) {
    // 4.1 returnare eroare api
    console.error("❌ Error:", error);
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    }
    // 4.2 Returnare orice alta eroare
    res.status(500).send(error.message);
  }
};
