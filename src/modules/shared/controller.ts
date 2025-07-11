import { Request, Response } from "express";

import pool from "../../config/db";
import { ApiError } from "../../utils/ApiError";
import {
  effectSettingsReqSchema,
  getEffectSchema,
  kickEffectSettingsSchema,
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
    const effect = await pool.query("SELECT * FROM effects WHERE name = $1 ", [
      parsedQuery.data?.effect_name,
    ]);
    //
    if (effect.rows.length === 0) {
      res.status(404).json({ error: "Effect not found" });
      return;
    }
    //
    const effect_id = effect.rows[0].id;
    //
    console.log("parsedQuery.data?.app_user_id", parsedQuery.data?.app_user_id);
    const effects = await pool.query(
      "SELECT * FROM user_x_effects WHERE app_user_id = $1 AND effect_id = $2",
      [parsedQuery.data?.app_user_id, effect_id]
    );
    console.log("effects.rows[0]", effects.rows[0]);
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
//TODO: fa magia
export const getEffectSettingsFromKickId = async (
  req: Request,
  res: Response
) => {
  try {
    console.log(req.query);
    // //validate
    const parsedQuery = kickEffectSettingsSchema.safeParse(req.query);
    if (!parsedQuery.success) {
      res.status(400).json({
        error: "Invalid request query",
        details: parsedQuery.error.errors,
      });
      return;
    }
    const platform_id = parsedQuery.data.platform_id;

    //connections_to_platform ia app_user_id
    const connectionToPlatform = await pool.query(
      "select * from connections_to_platform where platform_user_id = $1",
      [parsedQuery.data?.platform_id]
    );

    if (connectionToPlatform.rows.length === 0) {
      res.status(404).json({ error: "Connection not found" });
      return;
    }

    const app_user_id = connectionToPlatform.rows[0].app_user_id;
    console.log("app_user_id", app_user_id);
    /////////////////////////////////////
    //cauta ce id are effectul cu numele effect_name si ia-i id-ul

    const effect = await pool.query("SELECT * FROM effects WHERE name = $1 ", [
      parsedQuery.data?.effect_name,
    ]);

    if (effect.rows.length === 0) {
      res.status(404).json({ error: "Effect not found" });
      return;
    }

    const effect_id = effect.rows[0].id;

    //acum cauta setarile effectului

    const effectsSettings = await pool.query(
      "SELECT * FROM user_x_effects WHERE app_user_id = $1 AND effect_id = $2",
      [app_user_id, effect_id]
    );
    console.log("effects.rows[0]", effectsSettings.rows[0]);
    // 3.returnare succes
    res.status(200).json(effectsSettings.rows[0]);

    ///

    const effectSettings = await pool.query(
      "SELECT * FROM user_x_effects WHERE app_user_id = $1",
      [app_user_id]
    );
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
    console.log(req.body);
    //validate
    const parsedBody = updateEffectSettingsSchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({
        error: "Invalid request body",
        details: parsedBody.error.errors,
      });
      return;
    }
    //search effect in db, get id

    console.log("1");

    const effect = await pool.query("SELECT * FROM effects WHERE name = $1 ", [
      parsedBody.data?.effect_name,
    ]);

    console.log("2");

    if (effect.rows.length === 0) {
      res.status(400).json({ error: "Effect not found" });
      return;
    }

    console.log("3");

    console.log("effect.rows[0].id", effect.rows[0].id);
    const effect_id = effect.rows[0].id;

    console.log("4");

    //check if user has settings for effect
    const effectSettings = await pool.query(
      "SELECT * FROM user_x_effects WHERE app_user_id = $1 AND effect_id = $2",
      [parsedBody.data?.app_user_id, effect_id]
    );

    console.log("5");

    if (effectSettings.rows.length === 0) {
      console.log("6");
      await pool.query(
        "INSERT INTO user_x_effects (app_user_id, effect_id, settings) VALUES ($1, $2, $3)",
        [parsedBody.data?.app_user_id, effect_id, parsedBody.data?.settings]
      );
    } else {
      console.log("7");
      await pool.query(
        "UPDATE user_x_effects SET settings = $1 WHERE app_user_id = $2 AND effect_id = $3",
        [parsedBody.data?.settings, parsedBody.data?.app_user_id, effect_id]
      );
    }

    console.log("8");

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
