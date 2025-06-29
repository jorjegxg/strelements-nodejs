import pool from "../../config/db";
import { NameOfPlatform } from "./types";
//TODO: Revino aiaic

export const createConnectionToPlatform = async (
  nameOfPlatform: NameOfPlatform,
  app_user_id: number,
  platform_user_id: number
) => {
  try {
    //1. get platform id of the platform
    const query1 = `select * from platforms where NAME = $1`;
    const values1 = [nameOfPlatform];
    let respone = await pool.query(query1, values1);
    let platform_id = respone.rows[0].id;

    //2. add user connection
    const query2 = `INSERT INTO connections_to_platform (app_user_id, platform_id, platform_user_id ) VALUES ($1, $2,$3)`;
    const values2 = [app_user_id, platform_id, platform_user_id];
    await pool.query(query2, values2);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};
