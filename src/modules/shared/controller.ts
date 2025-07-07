import { Request, Response } from "express";

import pool from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import {
  effectSettingsReqSchema,
  getEffectSchema,
  updateEffectSettingsSchema,
} from "./schema";

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

export const getEffectSettings = async (req: Request, res: Response) => {
  try {
    console.log(req.query);
    //validate
    const parsedQuery = effectSettingsReqSchema.safeParse(req.query);
    if (!parsedQuery.success) {
      res.status(400).json({
        error: "Invalid request query",
        details: parsedQuery.error.errors,
      });
      return;
    }
    //
    console.log("parsedQuery.data?.app_user_id", parsedQuery.data?.app_user_id);
    const effects = await pool.query(
      "SELECT * FROM user_x_effects WHERE app_user_id = $1 AND effect_id = $2",
      [parsedQuery.data?.app_user_id, parsedQuery.data?.effect_id]
    );
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
export const updateEffectSettings = async (req: Request, res: Response) => {
  try {
    console.log(req.query);
    //validate
    const parsedQuery = updateEffectSettingsSchema.safeParse(req.body);
    if (!parsedQuery.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: parsedQuery.error.errors,
      });
      return;
    }
    //check if exists
    const effect = await pool.query(
      "SELECT * FROM user_x_effects WHERE app_user_id = $1 AND effect_id = $2",
      [parsedQuery.data?.app_user_id, parsedQuery.data?.effect_id]
    );

    if (effect.rows.length === 0) {
      await pool.query(
        "INSERT INTO user_x_effects (app_user_id, effect_id, settings) VALUES ($1, $2, $3)",
        [
          parsedQuery.data?.app_user_id,
          parsedQuery.data?.effect_id,
          parsedQuery.data?.settings,
        ]
      );
    } else {
      await pool.query(
        "UPDATE user_x_effects SET settings = $1 WHERE app_user_id = $2 AND effect_id = $3",
        [
          parsedQuery.data?.settings,
          parsedQuery.data?.app_user_id,
          parsedQuery.data?.effect_id,
        ]
      );
    }

    // 3.returnare succes
    res.status(200).json({ message: "ok" });
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
